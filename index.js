import express from 'express'
import {dirname} from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import { create } from 'express-handlebars';
import { faker } from '@faker-js/faker';


//Express objekto inicijavimas
const app = express()
const hbs = create({ /* config */ });
const __dirname = dirname(fileURLToPath(import.meta.url))

const randomName = faker.name.findName(); // Willie Bahringer
const randomEmail = faker.internet.email(); // Tomasa_Ferry14@hotmail.com
const randomPhoneNumber = faker.phone.phoneNumber(); // 938-672-1359 x418
const randomAvatar = faker.image.avatar();
const randomCar = faker.vehicle.vehicle();
const randomCompany = faker.company.companyName();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './templates');

app.get('/', (req, res) => {
  let name = randomName
  let car = randomCar
  let number = randomPhoneNumber
  let photo = randomAvatar
  let email = randomEmail
  let company = randomCompany
   // res.sendFile(__dirname + '/templates/forma.html')
   res.render('loop', {name, car, number, photo, email, company})
})
// app.get('/loop', (req, res) => {
//   let variables = {
//     name: randomName,
//     car: randomCar,
//     number: randomPhoneNumber,
//     photo: randomAvatar,
//     email : randomEmail,
//     company : randomCompany
    
    
//   }
   
//    res.render('loop', variables)
// })

app.get('/client-submit', async (req, res) => {
    if(parseInt( Object.keys(req.query).length ) > 0) {

      let json = []

      try {
          const data = await fs.readFile('./database.json', 'utf8')

          let parsedJson = JSON.parse(data)

          parsedJson.push(req.query)

          json = parsedJson
      
      } catch {
          json.push(req.query)

          console.log('Duomenu bazes failas sukurtas')
      }
      
      //Informacijos issaugojimas faile
      
      await fs.writeFile('./database.json', JSON.stringify(json))

      res.send('Duomenys sėkmingai priimti')
    } else {
      res.send('Nėra gauta jokių duomenų')
    }
})

app.get('/clients', async (req, res) => {
  const data = await fs.readFile('./database.json', 'utf8')

  let masyvas = JSON.parse(data)
  let html = `<table>
              <thead>
                <th>Vardas</th>
                <th>Pavardė</th>
                <th>Adresas</th>
                <th>Telefonas</th>
                <th>El. paštas</th>
              </thead> 
              <tbody>           
              `
  
    masyvas.forEach(value => {
      html +=  `<tr>
                  <td>${value.name}</td>
                  <td>${value.pavarde}</td>
                  <td>${value.adresas}</td>
                  <td>${value.telefonas}</td>
                  <td>${value.elpastas}</td>
                </tr>`
    })

  html += '</tbody></table>'

  res.send(html)
})

//Sukuria serveri priskiriant jam routerius
app.listen(3000)
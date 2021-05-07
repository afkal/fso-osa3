require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// Define token
morgan.token('type', function (req, res) {
  if(req.method == 'POST') return JSON.stringify(req.body)
})

// setup the logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
/*
let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]
*/
/*
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
*/
app.get('/info', (req, res) => {
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'long'};
  options.timeZone = 'EET';
  options.timeZoneName = 'long';
  let event = new Date().toLocaleString('en-US', options)
  res.send(
    `<p>Phonebook has in for ${Person.length} people</p>
    <p>${event}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  /*
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // Check if name already exists
  const nameExists = Person.find(person => {
    return (person.name === body.name)
  })

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  // Check if number already exists
  const numberExists = Person.find(person => {
    return (person.number === body.number)
  })

  if (numberExists) {
    return response.status(400).json({
      error: 'number must be unique'
    })
  }
*/
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

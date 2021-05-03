const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())


// Define token
morgan.token('type', function (req, res) {
  if(req.method == 'POST') return JSON.stringify(req.body)
})

// setup the logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

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

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'long'};
  options.timeZone = 'EET';
  options.timeZoneName = 'long';
  let event = new Date().toLocaleString('en-US', options)
  res.send(
    `<p>Phonebook has in for ${persons.length} people</p>
    <p>${event}</p>`
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => {
    return person.id === id
  })
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

const generateId = () => {
  return Math.floor(Math.random() * 99999999)+1;
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // Check if name already exists
  const nameExists = persons.find(person => {
    return (person.name === body.name)
  })

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  // Check if number already exists
  const numberExists = persons.find(person => {
    return (person.number === body.number)
  })

  if (numberExists) {
    return response.status(400).json({
      error: 'number must be unique'
    })
  }


  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
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

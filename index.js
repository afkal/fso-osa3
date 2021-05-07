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

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//app.put('/api/persons/:id', (request, response, next) => {
app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    //.catch(error => next(error))
})

// olemattomien osoitteiden käsittely
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

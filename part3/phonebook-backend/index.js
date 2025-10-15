require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

const Person = require('./models/person')

const PORT = process.env.PORT

morgan.token('req-body', (request, response) => {
  return JSON.stringify(request.body)
})

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :req-body'
)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'nonexistent endpoint' })
}

app.use(express.json())
app.use(requestLogger)

app.use(express.static('dist'))
app.get('/info', (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people<br/>${new Date()}`
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => {
      console.log(error)
      response.status(500).end()
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  // const person = persons.find((p) => p.id === id)

  Person.findOne({ _id: id }).then((person) => {
    if (!person) response.status(404).json({ error: 'no entry found' })
    else response.json(person)
  })

  // if (!person) {
  //   response.status(404).end()
  // } else response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then((person) => {
      if (!person) {
        response.status(400).json({ error: 'no matching entry.' })
      } else response.json(person)
    })
    .catch((error) => response.status(500).json({ error: error.message }))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  // if (!body.name) error = error.concat('name is required')
  // if (!body.number) error = error.concat('number is required')

  // if (persons.find((p) => p.name === body.name))
  //   error = error.concat(`${body.name} already exists in the phonebook`)

  // if (error.length > 0) {
  //   console.log('error:', error)
  //   return response.status(400).json(error)
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    // id: getRandomId(903310),
  })

  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => response.status(500).json({ error: error.message }))
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  if (!body.number)
    return response
      .status(400)
      .json({ error: 'malformed request. number is required' })

  const id = request.params.id

  Person.findOneAndUpdate(
    { _id: id },
    { number: body.number },
    { returnOriginal: false }
  ).then((updatedPerson) => {
    if (!updatedPerson)
      response.status(404).json({ error: 'something went wrong!' })
    else response.json(updatedPerson)
  })
})

app.use(unknownEndpoint)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

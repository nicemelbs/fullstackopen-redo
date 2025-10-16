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

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send(error.message)
  }

  next(error)
}

app.use(express.json())
app.use(requestLogger)

app.use(express.static('dist'))
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((count) =>
      response.send(`Phonebook has info for ${count} people<br/>${new Date()}`)
    )
    .catch((error) => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => {
      next(error)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then((person) => {
      if (!person) return response.status(404).json({ error: 'no entry found' })
      else response.json(person)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then((person) => {
      if (!person) {
        return response.status(400).end()
      } else response.json(person)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({ name: name, number: number })

  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const number = request.body.number

  if (!number)
    return response
      .status(400)
      .json({ error: 'malformed request. number is required' })

  const id = request.params.id

  Person.findOneAndUpdate(
    { _id: id },
    { number: number },
    { returnOriginal: false }
  )
    .then((updatedPerson) => {
      if (!updatedPerson) return response.status(404).end()
      else response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

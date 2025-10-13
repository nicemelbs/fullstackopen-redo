const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

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
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((p) => p.id === id)

  if (!person) {
    response.status(404).end()
  } else response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((p) => p.id === id)
  persons = persons.filter((p) => p.id !== id)
  console.log('backend.index.js.delete.', person)

  response.json(person)
})

const getRandomId = (max) => {
  return String(Math.floor(Math.random() * max))
}
app.post('/api/persons', (request, response) => {
  const body = request.body
  let error = []

  if (!body.name) error = error.concat('name is required')
  if (!body.number) error = error.concat('number is required')

  if (persons.find((p) => p.name === body.name))
    error = error.concat(`${body.name} already exists in the phonebook`)

  if (error.length > 0) {
    console.log('error:', error)
    return response.status(400).json(error)
  }

  const person = {
    name: body.name,
    number: body.number,
    id: getRandomId(903310),
  }

  persons = persons.concat(person)
  response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  if (!body.number)
    return response
      .status(400)
      .json({ error: 'malformed request. number is required' })

  const id = request.params.id
  const oldPerson = persons.find((person) => id === person.id)

  const updatedPerson = {
    ...oldPerson,
    number: request.body.number,
  }

  persons = persons.map((person) => (person.id === id ? updatedPerson : person))
  response.json(updatedPerson)
})

app.use(unknownEndpoint)
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

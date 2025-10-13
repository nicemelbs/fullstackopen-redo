const express = require('express')
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
  persons = persons.filter((p) => p.id !== id)

  response.status(204).end()
})

app.use(express.json())
const getRandomId = (max) => {
  return String(Math.floor(Math.random() * max))
}
app.post('/api/persons', (request, response) => {
  const body = request.body
  let error = []

  console.log('body:', body)

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const notesRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const note = await Note.findById(id)
  if (note) response.json(note)
  else response.status(404).end()
})

notesRouter.post('/', async (request, response) => {
  const { content, important } = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or invalid' })
  }

  const note = new Note({
    content: content,
    important: important || false,
    user: user._id,
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Note.findByIdAndDelete(id)
  response.status(204).end()
})

notesRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { content, important } = request.body

  const note = await Note.findById(id)
  if (!note) {
    return response.status(404).end()
  }

  note.content = content
  note.important = important

  const updatedNote = await note.save()
  response.json(updatedNote)
})

module.exports = notesRouter

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (username.length < 3) {
    response
      .status(400)
      .json({
        error:
          'username is too short. username must be at least 3 characters long',
      })
      .end()
  }

  if (password.length < 3) {
    response
      .status(400)
      .json({
        error:
          'password is too short. password must be at least 3 characters long',
      })
      .end()
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({ name, username, passwordHash })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    likes: 1,
    url: 1,
    user: 1,
  })

  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', {
    title: 1,
    author: 1,
    likes: 1,
    url: 1,
    user: 1,
  })

  console.log('usersRouter:', user)

  response.json(user)
})

module.exports = usersRouter

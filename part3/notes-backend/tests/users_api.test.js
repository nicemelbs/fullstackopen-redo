const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const api = supertest(app)
const helper = require('./users_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'sameuser',
      password: 'notimportant',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert(usersAtEnd.length, usersAtStart.length)
  })

  after(() => {
    mongoose.connection.close()
  })
})

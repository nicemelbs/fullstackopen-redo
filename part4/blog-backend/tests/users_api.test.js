const { describe, beforeEach, after, test } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const helper = require('../utils/users_helper')
const bcrypt = require('bcrypt')

describe('users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = {
      username: 'jperalta',
      name: 'Jacob Peralta',
      password: 'ninenine!',
    }
    const passwordHash = await bcrypt.hash(user.password, 10)
    const userObject = new User({ ...user, passwordHash })
    await userObject.save()
  })

  test('creation fails when username is already taken', async () => {
    const usersBefore = await helper.usersInDb()
    const user = {
      username: 'jperalta',
      name: 'notReallyJake',
      password: 'notreally!',
    }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersAfter.length, usersBefore.length)
  })

  test('creation succeeds with valid input', async () => {
    const validUser = {
      username: 'validusername',
      password: 'validpassword',
      name: 'Valid Name',
    }

    const usersBefore = await helper.usersInDb()
    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersBefore.length + 1, usersAfter.length)
  })

  describe('creation fails with proper status code and message', () => {
    test('username is too short', async () => {
      const usersBefore = await helper.usersInDb()

      const shortUsername = {
        username: 'iu',
        password: 'validpassword',
        name: 'short username',
      }
      const result = await api
        .post('/api/users')
        .send(shortUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(
        result.body.error.includes(
          'username is too short. username must be at least 3 characters long'
        )
      )

      const usersAfter = await helper.usersInDb()
      assert.strictEqual(usersAfter.length, usersBefore.length)
    })

    test('if password is too short', async () => {
      const usersBefore = await helper.usersInDb()
      const shortPassword = {
        username: 'validusername',
        password: 'ip',
        name: 'short password',
      }
      const result = await api
        .post('/api/users')
        .send(shortPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(
        result.body.error.includes(
          'password is too short. password must be at least 3 characters long'
        )
      )

      const usersAfter = await helper.usersInDb()
      assert.strictEqual(usersAfter.length, usersBefore.length)
    })
  })
})

after(() => {
  mongoose.connection.close()
})

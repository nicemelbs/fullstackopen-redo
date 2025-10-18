const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')

const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = helper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(helper.totalLikes([]), 0)
  })
  test('when list has only one blog equals the likes of that', () => {
    assert.strictEqual(helper.totalLikes([helper.initialBlogs[0]]), 7)
  })
  test('of a bigger list is calculated right', () => {
    assert.strictEqual(helper.totalLikes(helper.initialBlogs), 36)
  })
})

describe('favoriteBlog', () => {
  test('empty list returns null', () => {
    assert.deepStrictEqual(helper.favoriteBlog([]), null)
  })

  test('if only one blog, return the same blog', () => {
    assert.deepStrictEqual(
      helper.favoriteBlog([helper.initialBlogs[0]]),
      helper.initialBlogs[0]
    )
  })

  test('return the blog with most likes', () => {
    assert.deepStrictEqual(
      helper.favoriteBlog(helper.initialBlogs),
      helper.initialBlogs[2]
    )
  })
})

describe('mostBlogs', () => {
  test('empty list returns null', () => {
    assert.deepStrictEqual(helper.mostBlogs([]), null)
  })

  test('if only one blog, return the author and blog:1', () => {
    assert.deepStrictEqual(helper.mostBlogs([helper.initialBlogs[0]]), {
      author: 'Michael Chan',
      blogs: 1,
    })
  })

  test('return the proper value', () => {
    assert.deepStrictEqual(helper.mostBlogs(helper.initialBlogs), {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})

describe('mostLikes', () => {
  test('empty list returns null', () => {
    assert.deepStrictEqual(helper.mostLikes([]), null)
  })

  test('if only one blog, return author and likes of that blog', () => {
    assert.deepStrictEqual(helper.mostLikes([helper.initialBlogs[0]]), {
      author: 'Michael Chan',
      likes: 7,
    })
  })
  test('return proper value', () => {
    assert.deepStrictEqual(helper.mostLikes(helper.initialBlogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})

describe.only('blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  test('HTTP GET request works properly', async () => {
    const initialBlogs = helper.initialBlogs

    const fetchedBlogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(initialBlogs.length, fetchedBlogs.body.length)
  })

  test('can fetch one blog by id', async () => {
    const blogs = await helper.blogsInDb()

    const fetchedBlog = await api
      .get(`/api/blogs/${blogs[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(blogs[0], fetchedBlog.body)
  })

  test('get request to non-existent id returns 404', async () => {
    const nonExistentId = await helper.nonExistingId()
    await api.get(`/api/blogs/${nonExistentId}`).expect(404)
  })

  test('identifier of blogs object is id instead of _id', async () => {
    const id = '5a422bc61b54a676234d17fc'

    const result = await api.get(`/api/blogs/${id}`)

    assert(Object.prototype.hasOwnProperty.call(result.body, 'id'))
    assert(!Object.prototype.hasOwnProperty.call(result.body, '_id'))
  })

  test('post request successfully creates a blog', async () => {
    const newBlog = {
      title: 'Ang Diary ni Larry',
      author: 'Ultimate Ube',
      url: 'https://youtube.com',
      likes: 20,
    }

    const blogsBefore = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()

    assert.strictEqual(blogsBefore.length + 1, blogsAfter.length)
    const titles = blogsAfter.map((b) => b.title)
    assert(titles.includes(newBlog.title))
  })

  test('if likes property is missing from the request, default to 0', async () => {
    const blogWithoutLikes = {
      title: 'Nobody Likes Me',
      author: 'The Unlikeable',
      url: 'https://no.likes.here',
    }

    const result = await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.likes, 0)
  })

  test('if title or url properties are missing, return HTTP 400', async () => {
    const blogWithoutTitle = {
      author: 'The Unlikeable',
      url: 'https://no.likes.here',
      likes: 2,
    }

    await api.post('/api/blogs').send(blogWithoutTitle).expect(400)

    const blogWithoutUrl = {
      title: 'This One Has No URL',
      author: 'The Unlikeable',
      likes: 2,
    }

    await api.post('/api/blogs').send(blogWithoutUrl).expect(400)
  })

  test('a blog can be deleted', async () => {
    const id = helper.initialBlogs[0]._id
    const blogsAtStart = await helper.blogsInDb()
    await api.delete(`/api/blogs/${id}`).expect(204)
    const blogsAtEnd = await helper.blogsInDb()

    await api.get(`/api/blogs/${id}`).expect(404)

    assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})

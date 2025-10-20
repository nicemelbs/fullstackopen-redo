const _ = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const dummy = () => {
  return 1
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'will be deleted soon enough',
    author: 'I dont even exist',
    url: 'http://fourohfour.com',
    likes: 0,
  })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const totalLikes = (blogs) => {
  return blogs.reduce((a, b) => {
    return a + b.likes
  }, 0)
}

const logInAndGetToken = async () => {
  const usersCount = await User.countDocuments({})
  if (usersCount === 0) {
    await createNewUser()
  }

  const user = await User.findOne({})

  const userForToken = { username: user.username, id: user._id }
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })
  return `Bearer ${token}`
}

const createNewUser = async () => {
  const newUser = { username: 'hello', password: 'world', name: 'hello world' }
  const passwordHash = await bcrypt.hash(newUser.password, 10)

  const newUserObject = new User({
    username: newUser.username,
    passwordHash: passwordHash,
    name: newUser.name,
  })

  await newUserObject.save()
}

//return blog with most likes. if there are more than 1 with most blogs, just return one
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let maxIndex = 0
  blogs.forEach((blog, index) => {
    if (blogs[maxIndex].likes < blog.likes) maxIndex = index
  })

  return blogs[maxIndex]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorAndBlogCount = _.countBy(blogs, 'author')

  const arr = Object.keys(authorAndBlogCount).map((key) => {
    return { author: key, blogs: authorAndBlogCount[key] }
  })
  let maxIndex = 0
  arr.forEach((obj, index) => {
    if (arr[maxIndex].blogs < obj.blogs) maxIndex = index
  })

  return arr[maxIndex]
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const group = _.groupBy(blogs, 'author')
  const arr = Object.keys(group).map((key) => {
    return { author: key, values: group[key] }
  })

  const authorLikes = arr.map((obj) => {
    return {
      author: obj.author,
      likes: obj.values.reduce((a, b) => a + b.likes, 0),
    }
  })

  let maxIndex = 0

  authorLikes.forEach((author, index) => {
    if (authorLikes[maxIndex].likes < author.likes) maxIndex = index
  })

  return authorLikes[maxIndex]
}

module.exports = {
  dummy,
  initialBlogs,
  nonExistingId,
  blogsInDb,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  logInAndGetToken,
}

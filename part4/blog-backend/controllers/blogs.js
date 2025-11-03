const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    name: 1,
    username: 1,
  })

  if (blog) response.json(blog)
  else response.status(404).end()
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) response.status(401).json({ error: 'unauthorized action' }).end()

  const id = request.params.id
  const blogToDelete = await Blog.findById(id)
  if (String(user._id) !== String(blogToDelete.user))
    response.status(403).json({ error: 'you do not own this blog' }).end()
  else {
    user.blogs = user.blogs.filter((blog) => {
      return String(blog._id) !== id
    })

    await user.save()
    await blogToDelete.deleteOne()
    response.status(204).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  const user = request.user
  if (!user)
    return response.status(401).json({ error: 'userId missing or invalid' })

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user._id,
  })

  const savedBlog = await blog.populate('user', { username: 1, name: 1 })
  savedBlog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  console.log('router:comment', request.body)

  blog.comments = blog.comments.concat(request.body.comment)
  await blog.save()
  response.status(201).json(blog)
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  })
  blog.likes = request.body.likes

  await blog.save()

  response.status(200).json(blog)
})

module.exports = blogsRouter

import { useState, useEffect, useRef, useContext } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Togglelable'

import NotificationContext from './NotificationContext'
import { useQueryClient } from '@tanstack/react-query'

const App = () => {
  const queryClient = useQueryClient()
  const { flashNotificationForDuration } = useContext(NotificationContext)

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => sortBlogsThenSet(blogs))
  }, [])

  useEffect(() => {
    const loggedInUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
    if (loggedInUser) {
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
    }
  }, [])

  const sortBlogsThenSet = (blogs) => {
    const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)

    setBlogs(sortedBlogs)
  }

  const handleLogin = async (username, password) => {
    try {
      const loggedIn = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(loggedIn))
      blogService.setToken(loggedIn.token)
      setUser(loggedIn)
    } catch (error) {
      // setNotificationAndClearAfterNSeconds(error.response.data.error, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.incrementLikes(blog)
      const changeBlogList = blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
      sortBlogsThenSet(changeBlogList)
      flashNotificationForDuration(`You liked '${blog.title}'`)
    } catch (error) {
      // setNotificationAndClearAfterNSeconds(error.message, 'error')
      const errorMessage = error.response?.data.errror ?? error.message
      flashNotificationForDuration(errorMessage, false)
    }
  }

  const handleDelete = async (blog) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${blog.title} by ${blog.author}?`
      )
    ) {
      try {
        await blogService.deleteBlog(blog)
        const blogsWithoutTheDeleted = blogs.filter((b) => b.id !== blog.id)
        // setNotificationAndClearAfterNSeconds(
        //   `${blog.title} successfully deleted.`,
        //   'success'
        // )
        setBlogs(blogsWithoutTheDeleted)
      } catch (error) {
        // setNotificationAndClearAfterNSeconds(error.response.data.error, 'error')
      }
    }
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)

      sortBlogsThenSet(blogs.concat(newBlog))
      setNotificationAndClearAfterNSeconds(
        `${newBlog.title} by ${newBlog.author} successfully posted!`,
        'success'
      )
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      setNotificationAndClearAfterNSeconds(error.response.data.error, 'error')
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      <Notification />
      {!user && <LoginForm handleLogin={handleLogin} />}

      {user && (
        <div>
          <div>
            Welcome back, {user.name}{' '}
            <button onClick={handleLogout}>logout</button>
          </div>
          <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
            <CreateBlogForm handleCreateBlog={handleCreateBlog} />
          </Toggleable>
          <h2>blogs</h2>
          <ul>
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App

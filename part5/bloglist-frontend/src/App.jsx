import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [notification, setNotification] = useState({
    message: null,
    type: null,
  })

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedInUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
    if (loggedInUser) {
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedIn = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(loggedIn))
      blogService.setToken(loggedIn.token)
      setUsername('')
      setPassword('')
      setUser(loggedIn)
    } catch (error) {
      setNotificationAndClearAfterNSeconds(error.response.data.error, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = await blogService.create({
        title,
        author,
        url,
      })

      setBlogs(blogs.concat(newBlog))
      setNotificationAndClearAfterNSeconds(
        `${newBlog.title} by ${newBlog.author} successfully posted!`,
        'success'
      )
    } catch (error) {
      setNotificationAndClearAfterNSeconds(error.response.data.error, 'error')
    }
  }

  const setNotificationAndClearAfterNSeconds = (message, type, n = 5) => {
    setNotification({ message: message, type: type })
    setTimeout(() => {
      setNotification({ message: null })
    }, n * 1000)
  }

  return (
    <div>
      <Notification notification={notification} />
      {!user && (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={setUsername}
          handlePasswordChange={setPassword}
          handleSubmit={handleLogin}
        />
      )}

      {user && (
        <div>
          <div>
            Welcome back, {user.name}{' '}
            <button onClick={handleLogout}>logout</button>
          </div>

          <CreateBlogForm
            title={title}
            author={author}
            url={url}
            setTitle={setTitle}
            setAuthor={setAuthor}
            setUrl={setUrl}
            handleCreateBlog={handleCreateBlog}
          />

          <h2>blogs</h2>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App

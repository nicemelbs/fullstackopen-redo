import { useEffect } from 'react'

import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Togglelable'
import BlogsList from './components/BlogsList'

import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/loginReducer'
import { handleLogOut } from './reducers/loginReducer'

const App = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  return (
    <div>
      <Notification />
      {!user && <LoginForm />}

      {user && (
        <div>
          <div>
            {user.name} logged in.
            <button onClick={() => dispatch(handleLogOut())}>logout</button>
          </div>
          <Toggleable buttonLabel="create new blog">
            <CreateBlogForm />
          </Toggleable>
          <BlogsList />
        </div>
      )}
    </div>
  )
}

export default App

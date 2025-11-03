import { Routes, Route } from 'react-router-dom'
import blogService from './services/blogs'
import usersService from './services/users'

import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'

import { useQuery } from '@tanstack/react-query'
import BlogsList from './components/BlogsList'
import Menu from './components/Menu'
import Blog from './components/Blog'

const App = () => {
  const getUserFromLocalStorage = () => {
    const storedUser = window.localStorage.getItem('loggedInUser')
    if (!storedUser) return null
    const parsedUser = JSON.parse(storedUser)
    blogService.setToken(parsedUser.token)
    return parsedUser
  }
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUserFromLocalStorage,
  })

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
    refetchOnWindowFocus: false,
  })

  if (result.isLoading) return <div>Fetching data</div>
  if (result.isError) return <div>Something went wrong</div>
  return (
    <div>
      <Notification />
      {!user && <LoginForm />}
      {user && (
        <div>
          <Menu />

          <Routes>
            <Route path="/" element={<BlogsList />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/blogs/:id" element={<Blog />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App

import { useRef } from 'react'
import blogService from './services/blogs'

import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Togglelable'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import BlogsList from './components/BlogsList'

const App = () => {
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 10,
    retry: 1,
  })

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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    blogService.setToken(null)
    queryClient.setQueryData(['user'], null)
  }

  const blogFormRef = useRef()

  if (result.isLoading) {
    return <div>loading data...</div>
  } else if (result.isError) {
    return <div>We are having server issues. Please try again later.</div>
  }

  return (
    <div>
      <Notification />
      {!user && <LoginForm />}

      {user && (
        <div>
          <div>
            Welcome back, {user.name}{' '}
            <button onClick={handleLogout}>logout</button>
          </div>
          <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
            <CreateBlogForm />
          </Toggleable>
          <BlogsList />
        </div>
      )}
    </div>
  )
}

export default App

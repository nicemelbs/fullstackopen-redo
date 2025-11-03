import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import blogService from '../services/blogs'

const Menu = () => {
  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    blogService.setToken(null)
    queryClient.setQueryData(['user'], null)
  }

  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(['user'])

  return (
    <div>
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      {user.name} logged in. <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Menu

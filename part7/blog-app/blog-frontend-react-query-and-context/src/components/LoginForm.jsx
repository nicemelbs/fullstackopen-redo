import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import NotificationContext from '../NotificationContext'
const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const queryClient = useQueryClient()
  const { flashNotificationForDuration } = useContext(NotificationContext)

  const login = (event) => {
    event.preventDefault()
    userMutation.mutate({ username, password })
  }

  const userMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (loggedIn) => {
      window.localStorage.setItem('loggedInUser', JSON.stringify(loggedIn))
      blogService.setToken(loggedIn.token)
      queryClient.setQueryData(['user'], loggedIn)
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ?? error.message ?? 'Something went wrong.'
      flashNotificationForDuration(errorMessage, false)
    },
  })

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={login}>
        <label htmlFor="username">
          username:
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <br />
        <label htmlFor="password">
          password:
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <br />
        <button type="submit" disabled={username === '' || password === ''}>
          log in
        </button>
      </form>
    </div>
  )
}

export default LoginForm

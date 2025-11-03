import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import NotificationContext from '../NotificationContext'
import { useNavigate } from 'react-router-dom'

import { Form, Button } from 'react-bootstrap'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const queryClient = useQueryClient()
  const { flashNotificationForDuration } = useContext(NotificationContext)

  const navigate = useNavigate()
  const login = (event) => {
    event.preventDefault()
    userMutation.mutate({ username, password })
    navigate('/')
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
      <Form onSubmit={login}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={username === '' || password === ''}
        >
          log in
        </Button>
      </Form>
    </div>
  )
}

export default LoginForm

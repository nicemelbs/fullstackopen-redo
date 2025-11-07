import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'
import { LOGIN, ME } from '../queries'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const notify = props.notify
  const setToken = props.setToken
  const setPage = props.setPage

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      notify(error)
    },
    onCompleted: () => {
      setPage('authors')
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      console.log('result.data:', result.data)
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data])

  if (!props.show) {
    return null
  }
  const handleLogin = (event) => {
    event.preventDefault()
    console.log('logging in with ', { username, password })
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username{' '}
          <input
            value={username}
            type="text"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">log in</button>
      </form>
    </div>
  )
}
export default LoginForm

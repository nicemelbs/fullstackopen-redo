import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { handleLogIn } from '../reducers/loginReducer'
const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleFormSubmit = (event) => {
    event.preventDefault()
    dispatch(handleLogIn(username, password))
  }

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleFormSubmit}>
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

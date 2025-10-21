import { useState } from 'react'
const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()
    handleLogin(username, password)
  }
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

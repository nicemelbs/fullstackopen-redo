const LoginForm = ({
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          username{' '}
          <input
            type="text"
            value={username}
            onChange={({ target }) => handleUsernameChange(target.value)}
          />
        </label>
        <br />
        <label htmlFor="password">
          password{' '}
          <input
            type="password"
            value={password}
            onChange={({ target }) => handlePasswordChange(target.value)}
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

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { ME } from './queries'
import Recommended from './components/Recommended'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const user = useQuery(ME)

  useEffect(() => {
    if (user.data) setLoggedInUser(user.data.me)
    else setLoggedInUser(null)
  }, [token, user.data])

  const handleLogout = () => {
    setToken(null)
    setLoggedInUser(null)
    window.localStorage.removeItem('library-user-token')
  }

  const notify = (error) => {
    const errorMessages =
      typeof error === 'string'
        ? error
        : error.errors?.map((e) => e.message).join('\n') ??
          'Something went wrong'
    console.error(errorMessages)
    setErrorMessage(errorMessages)

    setTimeout(() => {
      setErrorMessage('')
    }, 5000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {loggedInUser && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommended')}>recommended</button>
          </>
        )}

        {!loggedInUser && (
          <button onClick={() => setPage('login')}>login</button>
        )}

        {loggedInUser && <button onClick={handleLogout}>logout</button>}
      </div>

      <Notification message={errorMessage} />
      <Authors
        show={page === 'authors'}
        loggedInUser={loggedInUser}
        notify={notify}
      />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} notify={notify} />
      <Recommended
        show={page === 'recommended'}
        user={loggedInUser}
        notify={notify}
      />

      {!loggedInUser && (
        <LoginForm
          setPage={setPage}
          show={page === 'login'}
          setToken={setToken}
          notify={notify}
        />
      )}
    </div>
  )
}

export default App

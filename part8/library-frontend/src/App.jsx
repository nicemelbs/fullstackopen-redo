import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

import { useState, useEffect } from 'react'
import { useQuery, useSubscription } from '@apollo/client/react'
import { BOOK_ADDED, ME, ALL_BOOKS, ALL_GENRES, ALL_AUTHORS } from './queries'
import Recommended from './components/Recommended'

export const updateBookAndGenreCache = (cache, addedBook) => {
  const newGenres = addedBook.genres
  const authorOfNewBook = addedBook.author

  const uniqueBy = (array, key) => {
    return Array.from(new Map(array.map((item) => [item[key], item])).values())
  }

  cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
    return { allBooks: uniqueBy(allBooks.concat(addedBook), 'title') }
  })

  cache.updateQuery({ query: ALL_GENRES }, ({ allGenres }) => {
    return { allGenres: [...new Set(allGenres.concat(newGenres))].toSorted() }
  })

  cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
    return { allAuthors: uniqueBy(allAuthors.concat(authorOfNewBook), 'name') }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState({
    message: '',
    isError: false,
  })
  const user = useQuery(ME)

  useEffect(() => {
    user.refetch()
    if (user.data && token) setLoggedInUser(user.data.me)
    else setLoggedInUser(null)
  }, [token, user.data])

  const handleLogout = () => {
    setPage('authors')
    localStorage.removeItem('library-user-token')
    setLoggedInUser(null)
    setToken(null)
  }

  const notify = (messageObject, isError = true) => {
    const message =
      typeof messageObject === 'string'
        ? messageObject
        : messageObject.errors?.map((m) => m.message).join('\n') ??
          (isError
            ? 'Something went wrong'
            : 'Something happened. Not an error.')

    if (isError) console.error(message)
    else console.log(message)
    setNotificationMessage({ message, isError })

    setTimeout(() => {
      setNotificationMessage('')
    }, 5000)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`, false)

      updateBookAndGenreCache(client.cache, addedBook)
    },
  })

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

      <Notification notificationMessage={notificationMessage} />
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

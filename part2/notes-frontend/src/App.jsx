import { useEffect, useState, useRef } from 'react'
import noteService from './services/notes'
import loginService from './services/login'

import Note from './components/Note'
import NoteForm from './components/NoteForm'
import Footer from './components/Footer'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Toggleable from './components/Togglelable'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const handleLogin = async (username, password) => {
    console.log('logging in with username:', username)

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))

      noteService.setToken(user.token)
      setUser(user)
    } catch {
      setErrorMessageAndClearAfterNSeconds('wrong credentials', 5)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteAppUser')
    setUser(null)
    noteService.setToken(null)
  }

  const handleAddNote = (newNoteObject) => {
    noteFormRef.current.toggleVisibility()

    noteService
      .create(newNoteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote))
      })
      .catch((error) => {
        setErrorMessageAndClearAfterNSeconds(error.response.data.error, 5)
      })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)))
      })
      .catch((error) => {
        setErrorMessageAndClearAfterNSeconds(error.message, 5)
        setNotes(notes.filter((n) => n.id !== id))
      })
  }

  const setErrorMessageAndClearAfterNSeconds = (errorMessage, n = 5) => {
    setErrorMessage(errorMessage)
    setTimeout(() => {
      setErrorMessage(null)
    }, n * 1000)
  }

  const loginForm = () => {
    return (
      <Toggleable buttonLabel="log in">
        <LoginForm handleLogin={handleLogin} />
      </Toggleable>
    )
  }

  const noteFormRef = useRef()
  const noteForm = () => {
    return (
      <div>
        <p>Welcome back, {user.name}.</p>
        <button onClick={handleLogout}>log out</button>
        <Toggleable ref={noteFormRef} buttonLabel="new note">
          <NoteForm handleAddNote={handleAddNote} />
        </Toggleable>
      </div>
    )
  }
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && noteForm()}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  )
}

export default App

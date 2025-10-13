import { useEffect, useState } from 'react'
import noteService from './services/notes'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }
  useEffect(hook, [])

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const addNote = (event) => {
    event.preventDefault()

    const newNoteObject = {
      content: newNote.trim(),
      important: Math.random() < 0.5,
    }

    noteService.create(newNoteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const handleNewNoteChange = (event) => {
    setNewNote(event.target.value)
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
        // console.log(error.message)
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
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
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

      <form onSubmit={addNote}>
        <input
          onChange={handleNewNoteChange}
          value={newNote}
          placeholder="What's on your mind?"
        />
        <button type="submit" disabled={newNote.trim().length === 0}>
          save
        </button>
      </form>

      <Footer />
    </div>
  )
}

export default App

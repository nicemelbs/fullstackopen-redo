import { createSlice } from '@reduxjs/toolkit'
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote: (state, action) => {
      state.push(action.payload)
    },
    setNotes: (state, action) => {
      return action.payload
    },
    toggleImportanceOf: (state, action) => {
      const id = action.payload
      const noteToChange = state.find((n) => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important,
      }

      return state.map((note) => (note.id !== id ? note : changedNote))
    },
  },
})

export const { setNotes, createNote } = noteSlice.actions
export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export const appendNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content)
    dispatch(createNote(newNote))
  }
}
export const { toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer

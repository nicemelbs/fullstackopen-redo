import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote: (state, action) => {
      state.push(action.payload)
    },

    setAnecdotes: (state, action) => {
      return action.payload
    },
    updateVoted: (state, action) => {
      const updatedAnecdote = action.payload
      const updatedId = updatedAnecdote.id

      return state.map((anecdote) =>
        anecdote.id === updatedId ? updatedAnecdote : anecdote
      )
    },
  },
})

export const { setAnecdotes, createAnecdote, updateVoted } =
  anecdoteSlice.actions

export const initializeAnecdoes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const vote = (content) => {
  return async (dispatch) => {
    const response = await anecdoteService.voteFor(content)

    dispatch(updateVoted(response))
  }
}

export default anecdoteSlice.reducer

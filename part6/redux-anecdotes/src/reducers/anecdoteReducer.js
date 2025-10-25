import { createSlice } from '@reduxjs/toolkit'

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
    voteFor: (state, action) => {
      const id = action.payload
      const anecdoteVoted = state.find((a) => a.id === id)
      const anecdoteWithPlusOneVote = {
        ...anecdoteVoted,
        votes: anecdoteVoted.votes + 1,
      }

      return state.map((anecdote) =>
        anecdote.id === id ? anecdoteWithPlusOneVote : anecdote
      )
    },
  },
})

export const { createAnecdote, voteFor, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer

import { useContext } from 'react'
import { createAnecdote } from '../requests'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import NotificationContext from '../NotificationContext'
const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { flashNotificationForDuration } = useContext(NotificationContext)

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))

      flashNotificationForDuration({
        kind: 'success',
        message: `You posted "${newAnecdote.content}"`,
      })
    },
    onError: (error) => {
      flashNotificationForDuration({
        kind: 'error',
        message: error.message,
      })
    },
  })
  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

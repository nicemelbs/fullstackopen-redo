import { useQueryClient, useMutation } from '@tanstack/react-query'
import { updateAnecdote } from '../requests'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const AnecdotesList = ({ anecdotes }) => {
  const queryClient = useQueryClient()
  const { flashNotificationForDuration } = useContext(NotificationContext)

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote,
        ),
      )

      flashNotificationForDuration({
        kind: 'success',
        message: `You voted "${updatedAnecdote.content}"`,
      })
    },
    onError: (error) => {
      flashNotificationForDuration({
        kind: 'error',
        message: error.message,
      })
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }
  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}
export default AnecdotesList

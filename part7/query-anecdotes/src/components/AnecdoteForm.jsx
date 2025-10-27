import { createAnecdote } from '../requests'
import { useMutation, useQueryClient } from '@tanstack/react-query'
const AnecdoteForm = () => {
  const queryClient = useQueryClient()
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
    },
    onError: (error) => {
      queryClient.setQueryData(['notification'], error.message)
      setTimeout(() => {
        queryClient.setQueryData(['notification'], null)
        console.log('notification cleared.')
      }, 5000)
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

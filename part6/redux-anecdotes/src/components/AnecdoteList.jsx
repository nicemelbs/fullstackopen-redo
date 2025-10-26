import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { showNotificationForNSeconds } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  }).sort((a, b) => b.votes > a.votes)

  const dispatch = useDispatch()
  const handleVote = (anecdote) => {
    dispatch(vote(anecdote))
    dispatch(showNotificationForNSeconds(`You voted '${anecdote.content}'`, 5))
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

export default AnecdoteList

import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer'
import { showNotificationForNSeconds } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const create = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value

    event.target.anecdote.value = ''
    dispatch(appendAnecdote(content))
    dispatch(showNotificationForNSeconds(`You posted '${content}'`, 5))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}
export default AnecdoteForm

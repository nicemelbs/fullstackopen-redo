import { useState } from 'react'
import { appendBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
const CreateBlogForm = ({ toggleVisibility }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const createBlog = (event) => {
    event.preventDefault()
    const blogObject = { title, author, url }
    dispatch(appendBlog(blogObject))
    setTitle('')
    setAuthor('')
    setUrl('')
    toggleVisibility()
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={createBlog}>
        <label>
          title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <br />
        <label>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <br />
        <label>
          URL
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
        <br />
        <button type="submit">post</button>
      </form>
    </div>
  )
}
export default CreateBlogForm

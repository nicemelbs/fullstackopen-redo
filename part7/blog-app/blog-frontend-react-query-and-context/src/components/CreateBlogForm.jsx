import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useContext } from 'react'
import blogService from '../services/blogs'
import NotificationContext from '../NotificationContext'
const CreateBlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const queryClient = useQueryClient()
  const { flashNotificationForDuration } = useContext(NotificationContext)
  const createBlog = (event) => {
    event.preventDefault()
    const blogObject = { title, author, url }
    newBlogMutation.mutate(blogObject)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))

      flashNotificationForDuration(
        `Blog '${newBlog.title}' by ${newBlog.author} posted!`
      )

      queryClient.invalidateQueries(['users'])
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ?? error.message ?? 'Something went wrong'

      flashNotificationForDuration(errorMessage, false)
    },
  })

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

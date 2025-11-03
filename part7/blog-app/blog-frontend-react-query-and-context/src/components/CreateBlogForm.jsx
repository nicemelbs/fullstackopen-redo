import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useContext } from 'react'
import blogService from '../services/blogs'
import NotificationContext from '../NotificationContext'
import { Form, Button } from 'react-bootstrap'

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
    <div className="container">
      <h2>create new</h2>

      <Form onSubmit={createBlog}>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author</Form.Label>
          <Form.Control
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Button type="submit" variant="primary">
            Post
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}
export default CreateBlogForm

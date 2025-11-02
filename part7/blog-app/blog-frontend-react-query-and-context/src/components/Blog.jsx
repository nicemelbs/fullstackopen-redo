import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useState, useContext } from 'react'
import NotificationContext from '../NotificationContext'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const currentUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const deleteButtonVisible =
    currentUser && currentUser.username === blog.user.username

  const queryClient = useQueryClient()
  const { flashNotificationForDuration } = useContext(NotificationContext)

  const updateBlogMutation = useMutation({
    mutationFn: blogService.incrementLikes,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      )

      flashNotificationForDuration(`You liked '${updatedBlog.title}'`)
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ?? error.message ?? 'Something went wrong.'
      flashNotificationForDuration(errorMessage, false)
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: (response) => {
      console.log('mutation onSuccess delete', response.request.responseURL)
      const deletedId = response.request.responseURL.split('/').pop()

      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((b) => b.id !== deletedId)
      )
      flashNotificationForDuration('Blog deleted successfully.')
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ?? error.message ?? 'Something went wrong.'
      flashNotificationForDuration(errorMessage, false)
    },
  })

  const handleLike = () => {
    updateBlogMutation.mutate(blog)
  }

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete '${blog.title}' by ${blog.author}?`
      )
    ) {
      console.log('handleDelete', blog)

      deleteBlogMutation.mutate(blog)
    }
  }

  return (
    <li className="blog">
      <span className="blog-title">{blog.title}</span> by{' '}
      <span className="blog-author">{blog.author}</span>
      <button onClick={() => setDetailsVisible(!detailsVisible)}>
        {detailsVisible ? 'hide' : 'view'}
      </button>
      {detailsVisible && (
        <div>
          <a className="blog-url" target="_blank" href={blog.url}>
            {blog.url}
          </a>
          <br />
          <span className="blog-likes">likes {blog.likes}</span>
          <button onClick={handleLike}>like</button>
          <br />
          {blog.user.name}
          <br />
          {deleteButtonVisible && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
      )}
    </li>
  )
}

export default Blog

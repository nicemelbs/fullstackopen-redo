import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import NotificationContext from '../NotificationContext'
import blogService from '../services/blogs'
import { Link } from 'react-router-dom'
import CommentsSection from '../components/CommentsSection'

import { Button } from 'react-bootstrap'

const Blog = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const allBlogs = queryClient.getQueryData(['blogs'])
  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? allBlogs.find((b) => b.id === blogMatch.params.id)
    : null

  const currentUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const deleteButtonVisible =
    currentUser && currentUser.username === blog?.user.username

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
      queryClient.invalidateQueries(['users'])
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
      deleteBlogMutation.mutate(blog)

      navigate('/')
    }
  }

  if (!blog) return null
  return (
    <div className="container">
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a className="blog-url" target="_blank" href={blog.url}>
          {blog.url}
        </a>
        <br />
        <span className="blog-likes">likes {blog.likes}</span>
        <Button variant="outline-primary" onClick={handleLike}>
          like
        </Button>
        <br />
        Added by <Link to={`/users/${blog.user.id}`}>{blog.user.name}</Link>
        <br />
        {deleteButtonVisible && (
          <Button variant="outline-danger" onClick={handleDelete}>
            delete this blog
          </Button>
        )}
        <CommentsSection />
      </div>
    </div>
  )
}

export default Blog

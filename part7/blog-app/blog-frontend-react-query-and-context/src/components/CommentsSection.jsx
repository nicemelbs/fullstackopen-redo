import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMatch } from 'react-router-dom'
import NotificationContext from '../NotificationContext'
import blogService from '../services/blogs'
import { useContext, useRef } from 'react'
import { Form, Button, ListGroup, ListGroupItem } from 'react-bootstrap'
const CommentsSection = () => {
  const queryClient = useQueryClient()
  const blogMatch = useMatch('/blogs/:id')
  const blogs = queryClient.getQueryData(['blogs'])
  const blog = blogs.find((b) => b.id === blogMatch.params.id)
  let comments = blog.comments

  const { flashNotificationForDuration } = useContext(NotificationContext)

  const blogMutation = useMutation({
    mutationFn: blogService.addComment,
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ?? error.message ?? 'Something went wrong'
      flashNotificationForDuration(errorMessage, false)
    },
    onSuccess: () => {
      flashNotificationForDuration('Comment added.')
      queryClient.invalidateQueries(['blogs'])
    },
  })

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    const comment = commentRef.current.value

    console.log('comment?', comment)

    blogMutation.mutate({ id: blog.id, comment })
    commentRef.current.value = ''
  }

  const commentRef = useRef()
  return (
    <div className="container mt-3 mb-3">
      <h3>comments</h3>
      <Form onSubmit={handleCommentSubmit}>
        <Form.Control
          ref={commentRef}
          type="text"
          placeholder="Add a comment"
        />
        <Button
          variant="primary"
          type="submit"
          className="btn-sm ms-auto d-block"
        >
          submit
        </Button>
      </Form>
      {comments.length > 0 && (
        <ListGroup className="container mt-3 mb-3">
          {comments.map((comment, i) => (
            <ListGroupItem key={i}>{comment}</ListGroupItem>
          ))}
        </ListGroup>
      )}
      {comments.length === 0 && (
        <div className="container">No comments yet. Add the first!</div>
      )}
    </div>
  )
}

export default CommentsSection

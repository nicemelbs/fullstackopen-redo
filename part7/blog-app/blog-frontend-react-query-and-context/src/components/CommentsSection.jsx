import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMatch } from 'react-router-dom'
import NotificationContext from '../NotificationContext'
import blogService from '../services/blogs'
import { useContext, useRef } from 'react'
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

    blogMutation.mutate({ id: blog.id, comment })
    commentRef.current.value = ''
  }

  const commentRef = useRef()
  return (
    <div>
      <h3>comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <input ref={commentRef} type="text" placeholder="Add a comment" />
        <button type="submit">submit</button>
      </form>
      {comments.length > 0 && (
        <ul>
          {comments.map((comment, i) => (
            <li key={i}>{comment}</li>
          ))}
        </ul>
      )}
      {comments.length === 0 && <div>No comments yet. Add the first!</div>}
    </div>
  )
}

export default CommentsSection

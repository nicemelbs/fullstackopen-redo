import { useQueryClient } from '@tanstack/react-query'
import Blog from './Blog'

const BlogsList = () => {
  const queryClient = useQueryClient()
  const blogs = queryClient
    .getQueryData(['blogs'])
    .sort((a, b) => b.likes - a.likes)
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog blog={blog} key={blog.id} />
      ))}
    </div>
  )
}

export default BlogsList

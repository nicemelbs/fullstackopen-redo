import { useDispatch, useSelector } from 'react-redux'
import { like, deleteBlog } from '../reducers/blogReducer'
import Blog from './Blog'

const BlogsList = () => {
  const stateBlogs = useSelector((state) => state.blogs)
  const blogs = [...stateBlogs].sort((a, b) => b.likes > a.likes)
  const dispatch = useDispatch()

  const handleLike = (blog) => {
    dispatch(like(blog))
  }
  const handleDelete = async (blog) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${blog.title} by ${blog.author}?`,
      )
    ) {
      dispatch(deleteBlog(blog))
    }
  }

  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map((blog) => {
        return (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        )
      })}
    </div>
  )
}

export default BlogsList

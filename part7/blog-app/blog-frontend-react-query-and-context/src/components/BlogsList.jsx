import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import CreateBlogForm from './CreateBlogForm'
import Toggleable from './Togglelable'

import { useRef } from 'react'

const BlogsList = () => {
  const queryClient = useQueryClient()
  const blogs = queryClient.getQueryData(['blogs'])
  const blogsSorted = blogs.sort((a, b) => b.likes - a.likes)

  const blogFormRef = useRef()
  return (
    <div>
      <h2>blogs</h2>
      <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
        <CreateBlogForm />
      </Toggleable>
      <br />
      <br />
      <br />
      {blogsSorted.map((blog) => {
        return (
          <div className="blog" key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            <span> by {blog.author}</span>
          </div>
        )
      })}
    </div>
  )
}

export default BlogsList

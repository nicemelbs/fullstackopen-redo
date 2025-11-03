import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import CreateBlogForm from './CreateBlogForm'
import Toggleable from './Togglelable'
import { Table } from 'react-bootstrap'

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
      <Table striped>
        <tbody>
          {blogsSorted.map((blog) => {
            return (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </td>
                <td>{blog.author}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default BlogsList

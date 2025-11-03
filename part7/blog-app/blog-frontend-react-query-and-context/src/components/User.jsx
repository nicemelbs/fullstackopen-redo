import { useMatch } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
const User = () => {
  const queryClient = useQueryClient()
  const userMatch = useMatch('/users/:id')
  const users = queryClient.getQueryData(['users'])
  const user = userMatch
    ? users?.find((u) => u.id === userMatch.params.id)
    : null
  if (!users) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <Table striped>
        <tbody>
          {user.blogs?.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
              <td>{blog.author}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default User

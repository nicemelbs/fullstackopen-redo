import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
const Users = () => {
  const queryClient = useQueryClient()
  const users = queryClient.getQueryData(['users'])
  if (!users) return <div>Fetching data...</div>

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <thead>
          <tr>
            <th>name</th>
            <th>blogs posted</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={user.id}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
export default Users

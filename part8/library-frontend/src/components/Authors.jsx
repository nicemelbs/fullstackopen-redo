import { ALL_AUTHORS } from '../queries'
import { useQuery } from '@apollo/client/react'
import AuthorForm from './AuthorForm'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const authors = result.data?.allAuthors ?? []
  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.loggedInUser && (
        <AuthorForm authors={authors} notify={props.notify} />
      )}
    </div>
  )
}

export default Authors

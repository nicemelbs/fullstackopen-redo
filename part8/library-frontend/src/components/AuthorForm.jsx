import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
const AuthorForm = ({ authors }) => {
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error(error)
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.target
    const formData = new FormData(form)

    editAuthor({
      variables: { name: formData.get('author'), setBornTo: Number(born) },
    })
    setBorn('')
  }

  const handleAuthorNameChange = (event) => {
    const authorBorn =
      authors.find((a) => a.name === event.target.value).born ?? ''
    setBorn(authorBorn)
  }

  return (
    <div>
      <h2>Edit author info</h2>
      <form onSubmit={handleSubmit}>
        name
        <select name="author" onChange={handleAuthorNameChange}>
          {authors.map((author) => (
            <option key={author.name} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>
        <br />
        born
        <input
          type="number"
          onChange={({ target }) => setBorn(target.value)}
          name="born"
          value={born}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  )
}
export default AuthorForm

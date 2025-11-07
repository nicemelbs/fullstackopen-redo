const Recommended = (props) => {
  const { user, show, notify } = props

  if (!show) return null

  if (!user) {
    notify('You must be logged in to view this page.')
    return null
  }

  const books = user.favoriteBooksInGenre

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books based on your favorite genre:{' '}
        <strong>{user.favoriteGenre}</strong>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Recommended

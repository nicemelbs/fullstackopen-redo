import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ALL_GENRES } from '../queries'
import { useState } from 'react'
import { useEffect } from 'react'

const Books = (props) => {
  const [allGenres, setAllGenres] = useState([])
  const result = useQuery(ALL_BOOKS)
  const books = result.data?.allBooks ?? []

  const genreQuery = useQuery(ALL_GENRES)
  useEffect(() => {
    if (!genreQuery.loading) {
      setAllGenres(genreQuery.data.allGenres)
    }
  }, [genreQuery.data])

  if (!props.show) {
    return null
  }

  const filterByGenre = (genre) => {
    let filter = { genre: null }
    if (genre !== 'all') filter = { genre }

    result.refetch(filter)
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h2>genres:</h2>
        <button onClick={() => filterByGenre('all')}>all</button>
        {allGenres.map((genre) => (
          <button key={genre} onClick={() => filterByGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books

import CountryDetails from './CountryDetails'

const SearchList = ({ countries, showDetails }) => {
  if (countries.length === 0)
    return <div>No matches. Please try a different search string.</div>

  if (countries.length > 10)
    return <div>Too many matches. Type in a more specific search term.</div>

  if (countries.length === 1) return <CountryDetails country={countries[0]} />

  return (
    <div>
      <ul>
        {countries.map((country) => (
          <li key={country.name.common}>
            {country.name.common}
            <span>&nbsp;</span>
            <button onClick={() => showDetails(country.name.common)}>
              show details
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default SearchList

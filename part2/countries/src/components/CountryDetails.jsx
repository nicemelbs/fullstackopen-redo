import Flag from './Flag'
import Weather from './Weather'

const CountryDetails = ({ country }) => {
  if (country === null) return

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Official name: {country.name.official}</div>
      <div>
        <div>Capital: {country.capital ? country.capital[0] : 'no data'}</div>
        <div>Area: {country.area}</div>
      </div>

      <div>
        <h2>Languages</h2>
        <ul>
          {country.languages !== undefined ? (
            Object.values(country.languages).map((language, i) => (
              <li key={i}>{language}</li>
            ))
          ) : (
            <li>No information</li>
          )}
        </ul>
      </div>

      <Flag country={country} />
      <Weather country={country} />
    </div>
  )
}
export default CountryDetails

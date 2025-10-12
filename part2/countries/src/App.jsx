import { useState, useEffect } from 'react'
import SearchList from './components/SearchList'
import CountryDetails from './components/CountryDetails'
import countriesService from './services/countries'

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [search, setSearch] = useState('')
  const [countryDetailsToShow, setCountryDetailsToShow] = useState(null)

  useEffect(() => {
    console.log('waiting for countries data...')

    countriesService.getAll().then((countries) => setAllCountries(countries))
  }, [])

  const handleSearchChange = (e) => {
    setCountryDetailsToShow(null)
    setSearch(e.target.value)
  }

  const showDetails = (name) => {
    setCountryDetailsToShow(
      filteredCountries.find((country) => country.name.common === name)
    )
  }

  const filteredCountries =
    allCountries.length > 0 && search !== ''
      ? allCountries.filter((country) =>
          country.name.common.toLowerCase().includes(search.toLowerCase())
        )
      : []

  return (
    <div>
      <div>
        find countries: <input onChange={handleSearchChange} value={search} />
        {/* Sometimes, the API takes a while to respond.*/}
        {allCountries.length > 0 ? (
          <SearchList showDetails={showDetails} countries={filteredCountries} />
        ) : (
          <div>Loading data. Please wait...</div>
        )}
        <CountryDetails country={countryDetailsToShow} />
      </div>
    </div>
  )
}
export default App

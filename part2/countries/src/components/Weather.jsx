import weatherService from '../services/weather'
import { useState, useEffect } from 'react'

const Weather = ({ country }) => {
  const [weather, setWeather] = useState()
  const capitalName = Object.prototype.hasOwnProperty.call(country, 'capital')
    ? country.capital[0]
    : country.name.common

  const lat = Object.prototype.hasOwnProperty.call(
    country.capitalInfo,
    'latlng'
  )
    ? country.capitalInfo.latlng[0]
    : country.latlng[0]

  const lng = Object.prototype.hasOwnProperty.call(
    country.capitalInfo,
    'latlng'
  )
    ? country.capitalInfo.latlng[1]
    : country.latlng[1]

  useEffect(() => {
    weatherService.getWeather(lat, lng).then((weatherResponse) => {
      setWeather(weatherResponse)
    })
  }, [lat, lng])

  if (!weather) return <div>Fetching weather data...</div>

  const weatherIcon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h2>Weather in {capitalName}</h2>

      <table>
        <thead>
          <tr>
            <th>
              <img src={weatherIcon} />
            </th>
            <th>{weather.weather[0].description}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Temperature</td>
            <td>{weather.main.temp}&deg;C</td>
          </tr>
          <tr>
            <td>Feels like</td>
            <td>{weather.main.feels_like}&deg;C</td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>{weather.main.humidity}%</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default Weather

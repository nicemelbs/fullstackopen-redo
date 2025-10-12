import axios from 'axios'

const api_key = import.meta.env.VITE_OPENWEATHERMAP_API_KEY
const units = 'metric'
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${api_key}&units=${units}`
const getWeather = (lat, lng) => {
  const requestUrl = `${baseUrl}&lat=${lat}&lon=${lng}`

  const request = axios.get(requestUrl)
  return request.then((response) => response.data)
}

export default { getWeather }

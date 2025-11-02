import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blogDetails) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }
  const response = await axios.post(baseUrl, blogDetails, config)
  return response.data
}

const incrementLikes = async (blogDetails) => {
  const newValues = {
    ...blogDetails,
    likes: blogDetails.likes + 1,
    user: blogDetails.user.id,
  }
  const response = await axios.put(`${baseUrl}/${blogDetails.id}`, newValues)

  return response.data
}

const deleteBlog = async (blog) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response
}

export default { getAll, create, setToken, incrementLikes, deleteBlog }

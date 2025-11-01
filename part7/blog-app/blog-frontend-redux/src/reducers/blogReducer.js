import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotificationForNSeconds } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],

  reducers: {
    createBlog: (state, action) => {
      state.push(action.payload)
    },
    setBlogs: (state, action) => {
      return action.payload
    },
    updateLiked: (state, action) => {
      const updatedBlog = action.payload
      const updatedId = updatedBlog.id
      return state.map((blog) => (blog.id === updatedId ? updatedBlog : blog))
    },
    removeBlog: (state, action) => {
      const deletedBlogId = action.payload.id
      return state.filter((blog) => blog.id !== deletedBlogId)
    },
  },
})

export const { setBlogs, createBlog, updateLiked, removeBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const appendBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(content)
      dispatch(createBlog(newBlog))
      dispatch(
        showNotificationForNSeconds(
          `${newBlog.title} by ${newBlog.author} successfully posted!`,
        ),
      )
    } catch (error) {
      const errorMessage = error.response.data.error ?? error.message
      dispatch(showNotificationForNSeconds(errorMessage, false))
    }
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(blog)
      dispatch(removeBlog(blog))
      dispatch(
        showNotificationForNSeconds(`${blog.title} successfully deleted.`),
      )
    } catch (error) {
      const errorMessage = error.response.data.error ?? error.message
      dispatch(showNotificationForNSeconds(errorMessage, false))
    }
  }
}

export const like = (content) => {
  return async (dispatch) => {
    try {
      const response = await blogService.incrementLikes(content)
      dispatch(updateLiked(response))
      dispatch(showNotificationForNSeconds(`You liked '${response.title}'`))
    } catch (error) {
      const errorMessage = error.response.data.error ?? error.message
      dispatch(showNotificationForNSeconds(errorMessage, false))
    }
  }
}

export default blogSlice.reducer

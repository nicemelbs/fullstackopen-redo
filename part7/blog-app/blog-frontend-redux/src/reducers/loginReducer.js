import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { showNotificationForNSeconds } from './notificationReducer'

const loginSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    logIn: (state, action) => {
      return action.payload
    },
    logOut: () => {
      return null
    },

    setUser: (state, action) => {
      return action.payload
    },
  },
})

export const { logIn, logOut, setUser } = loginSlice.actions

export const initializeUser = () => {
  return (dispatch) => {
    const loggedInUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
    if (loggedInUser) {
      blogService.setToken(loggedInUser.token)
    }
    dispatch(setUser(loggedInUser))
  }
}

export const handleLogIn = (username, password) => {
  return async (dispatch) => {
    try {
      const loggedInUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
      blogService.setToken(loggedInUser.token)
      dispatch(logIn(loggedInUser))
    } catch (error) {
      const errorMessage = error.response?.data.error ?? error.message
      dispatch(showNotificationForNSeconds(errorMessage, false))
    }
  }
}

export const handleLogOut = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedInUser')
    blogService.setToken(null)
    dispatch(logOut())
  }
}

export default loginSlice.reducer

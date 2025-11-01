import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',

  reducers: {
    setNotification: (state, action) => {
      return action.payload
    },

    clearNotification: () => {
      return ''
    },
  },
})

export const showNotificationForNSeconds =
  (message, isSuccess = true, seconds = 5) =>
  (dispatch) => {
    dispatch(setNotification({ message, isSuccess }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer

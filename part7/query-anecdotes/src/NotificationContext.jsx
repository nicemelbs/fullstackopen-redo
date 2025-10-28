import { createContext, useContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { message: action.message, type: action.kind }
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null,
  )
  const flashNotificationForDuration = (message, n = 5) => {
    notificationDispatch({ type: 'SET', message })

    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, n * 1000)
  }
  return (
    <NotificationContext.Provider
      value={{ flashNotificationForDuration, notification }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext

import NotificationContext from '../NotificationContext'
import { useContext } from 'react'

const Notification = () => {
  const { notification } = useContext(NotificationContext)
  if (!notification) return null
  const { message, kind } = notification.message

  const style = {
    border: 'solid',
    padding: 10,
    fontSize: 20,
    borderWidth: 3,
    marginBottom: 5,
    borderColor: kind === 'error' ? 'red' : 'green',
    color: kind === 'error' ? 'red' : 'green',
  }

  return message ? <div style={style}>{message}</div> : null
}

export default Notification

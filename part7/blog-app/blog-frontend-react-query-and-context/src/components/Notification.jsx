import NotificationContext from '../NotificationContext'
import { useContext } from 'react'
const Notification = () => {
  const { notification } = useContext(NotificationContext)

  if (!notification) return null

  const { message, isSuccess } = notification ?? {
    message: null,
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    borderThickness: 3,
    marginBottom: 10,
    display: isSuccess === '' ? 'none' : 'block',
    color: isSuccess ? 'green' : 'red',
  }

  return <div style={style}>{message}</div>
}

export default Notification

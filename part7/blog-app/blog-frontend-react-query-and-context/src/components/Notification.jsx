import NotificationContext from '../NotificationContext'
import { useContext } from 'react'
import { Alert } from 'react-bootstrap'
const Notification = () => {
  const { notification } = useContext(NotificationContext)

  if (!notification) return null

  const { message, isSuccess } = notification ?? {
    message: null,
  }

  return <Alert variant={isSuccess ? 'success' : 'danger'}>{message}</Alert>
}

export default Notification

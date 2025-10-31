import { useSelector } from 'react-redux'
const Notification = () => {
  const notification = useSelector((state) => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    borderThickness: 3,
    marginBottom: 10,
    display: notification === '' ? 'none' : 'block',
    color: notification.isSuccess ? 'green' : 'red',
  }

  return <div style={style}>{notification.message}</div>
}

export default Notification

const Notification = ({ notificationMessage }) => {
  const { message, isError } = notificationMessage
  if (!message) return null

  const styles = {
    color: isError ? 'red' : 'green',
    border: '2px solid',
    borderColor: isError ? 'red' : 'green',
    fontWeight: 'bold',
  }

  return <div style={styles}>{message}</div>
}

export default Notification

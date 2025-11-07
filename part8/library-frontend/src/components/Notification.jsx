const Notification = ({ message }) => {
  if (!message) return null

  const styles = {
    color: 'red',
    border: '2px solid red',
    fontWeight: 'bold',
  }

  return <div style={styles}>{message}</div>
}

export default Notification

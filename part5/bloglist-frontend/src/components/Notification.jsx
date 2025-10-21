const Notification = ({ notification }) => {
  const classes = `notification ${
    notification.type === 'error' ? 'error' : 'success'
  }`
  return notification.message !== null ? (
    <div className={classes}>{notification.message}</div>
  ) : null
}

export default Notification

export interface NotificationInterface {
  message: string | null;
  type: 'success' | 'error';
}

export interface NotificationProps {
  notification: NotificationInterface;
}

const Notification = (props: NotificationProps) => {
  const { message, type } = props.notification;

  if (!message) return null;
  const styleColor = type === 'success' ? 'green' : 'red';

  const style = {
    color: styleColor,
    border: `4px solid ${styleColor}`,
    padding: '5px',
  };

  return <div style={style}>{props.notification.message}</div>;
};
export default Notification;

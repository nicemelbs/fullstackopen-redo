import { Alert, Snackbar } from '@mui/material';

interface Props {
  severity: 'success' | 'error';
  message: string;
  open: boolean;
  onClose: () => void;
}

const Notification = (props: Props) => {
  const { onClose, severity, message, open } = props;

  return (
    <Snackbar
      style={{ width: '100%' }}
      autoHideDuration={5000}
      onClose={onClose}
      open={open}
    >
      <Alert variant="filled" severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;

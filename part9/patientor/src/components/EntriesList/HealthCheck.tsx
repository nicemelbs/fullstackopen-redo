import { Diagnosis, HealthCheckEntry } from '../../types';
import DiagnosesList from './DiagnosesList';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Dangerous, FavoriteOutlined } from '@mui/icons-material';
import { Container, Typography } from '@mui/material';
interface Props {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}
const HealthCheck = (props: Props) => {
  const { entry, diagnoses } = props;

  let healthIcon = null;
  switch (entry.healthCheckRating) {
    case 0:
      healthIcon = <FavoriteIcon color="success" />;
      break;
    case 1:
      healthIcon = <FavoriteIcon color="info" />;
      break;
    case 2:
      healthIcon = <FavoriteIcon color="warning" />;
      break;
    case 3:
      healthIcon = <Dangerous color="error" />;
      break;
    default:
      healthIcon = <FavoriteOutlined />;
  }

  return (
    <Container>
      <Typography>
        {entry.date} <MedicalInformationIcon />
      </Typography>
      <Typography fontStyle={'italic'}>{entry.description}</Typography>

      <DiagnosesList diagnoses={diagnoses} />

      <Container>{healthIcon}</Container>
      <Typography>Attenting physician: {entry.specialist}</Typography>
    </Container>
  );
};

export default HealthCheck;

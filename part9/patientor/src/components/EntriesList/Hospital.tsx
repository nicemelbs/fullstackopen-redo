import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Diagnosis, HospitalEntry } from '../../types';
import DiagnosesList from './DiagnosesList';
import { Container, Typography } from '@mui/material';

interface Props {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}
const Hospital = (props: Props) => {
  const { entry, diagnoses } = props;
  return (
    <Container>
      <Typography>
        {entry.date} <LocalHospitalIcon />
      </Typography>
      <Typography fontStyle={'italic'}>{entry.description}</Typography>
      <DiagnosesList diagnoses={diagnoses} />
      <Typography variant="h5">discharge</Typography>
      <Typography>
        {entry.discharge.date} {entry.discharge.criteria}
      </Typography>
      <Typography>Attending physician: {entry.specialist}</Typography>
    </Container>
  );
};

export default Hospital;

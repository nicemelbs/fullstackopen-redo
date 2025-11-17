import { Container, Typography } from '@mui/material';
import { Diagnosis, OccupationalHealthcareEntry } from '../../types';
import DiagnosesList from './DiagnosesList';
import { Masks } from '@mui/icons-material';

interface Props {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}
const OccupationalHealthcare = (props: Props) => {
  const { entry, diagnoses } = props;
  const sickLeave = entry.sickLeave;
  return (
    <Container>
      <Typography>
        {entry.date} <Masks />
      </Typography>
      <Typography fontStyle={'italic'}>{entry.description}</Typography>
      <Typography>employer: {entry.employerName}</Typography>
      <DiagnosesList diagnoses={diagnoses} />
      {sickLeave && (
        <div>
          <Typography variant="h5">Sick leave</Typography>
          <Typography>start: {sickLeave.startDate}</Typography>
          <Typography>end: {sickLeave.endDate}</Typography>
        </div>
      )}
      <Typography style={{ marginTop: '0.5em' }}>
        Attending physician: {entry.specialist}
      </Typography>
    </Container>
  );
};

export default OccupationalHealthcare;

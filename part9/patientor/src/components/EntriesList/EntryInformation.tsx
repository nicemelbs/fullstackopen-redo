import { useEffect, useState } from 'react';
import { Diagnosis, Entry } from '../../types';
import diagnosis from '../../services/diagnosis';
import HealthCheck from './HealthCheck';
import Hospital from './Hospital';
import OccupationalHealthcare from './OccupationalHealthcare';
import { assertNever } from '../../utils';
import { Box } from '@mui/material';

interface Props {
  entry: Entry;
}
const EntryInformation = (props: Props) => {
  const { entry } = props;
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchDiagnosesInfo = async () => {
      if (entry.diagnosisCodes) {
        const data = await diagnosis.getMany(entry.diagnosisCodes);
        setDiagnoses(data);
      }
    };

    fetchDiagnosesInfo();
  }, [entry.diagnosisCodes]);

  let element: React.JSX.Element;

  switch (entry.type) {
    case 'HealthCheck':
      element = <HealthCheck entry={entry} diagnoses={diagnoses} />;
      break;
    case 'Hospital':
      element = <Hospital entry={entry} diagnoses={diagnoses} />;
      break;
    case 'OccupationalHealthcare':
      element = <OccupationalHealthcare entry={entry} diagnoses={diagnoses} />;
      break;
    default:
      return assertNever(entry);
  }

  return (
    <Box border={1} borderRadius={5} margin={2}>
      {element}
    </Box>
  );
};

export default EntryInformation;

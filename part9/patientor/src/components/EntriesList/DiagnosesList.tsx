import { List, ListItem, Typography } from '@mui/material';
import { Diagnosis } from '../../types';

interface Props {
  diagnoses: Diagnosis[];
}

const DiagnosesList = (props: Props) => {
  const { diagnoses } = props;

  if (diagnoses.length === 0) return null;

  return (
    <>
      <Typography variant="h5" style={{ marginTop: '0.5em' }}>
        diagnoses
      </Typography>
      <List style={{ margin: 0, padding: 0 }}>
        {diagnoses.map((d) => (
          <ListItem key={d.code}>
            <Typography>
              [{d.code}] {d.name}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default DiagnosesList;

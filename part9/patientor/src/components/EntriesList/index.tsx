import { Container, Typography } from '@mui/material';
import { Entry } from '../../types';
import EntryInformation from './EntryInformation';

interface Props {
  entries: Entry[];
}
const EntriesList = (props: Props) => {
  return (
    <Container>
      <Typography variant="h5" marginTop={'0.5em'}>
        entries
      </Typography>
      {props.entries.map((entry) => (
        <EntryInformation key={entry.id} entry={entry} />
      ))}
    </Container>
  );
};

export default EntriesList;

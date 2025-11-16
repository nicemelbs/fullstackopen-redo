import { Entry } from '../../types';
import EntryInformation from './EntriesInformation';

interface Props {
  entries: Entry[];
}
const EntriesList = (props: Props) => {
  return (
    <div>
      <h3>entries</h3>
      {props.entries.map((entry) => (
        <EntryInformation key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default EntriesList;

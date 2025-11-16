import { useEffect, useState } from 'react';
import { Diagnosis, Entry } from '../../types';
import diagnosis from '../../services/diagnosis';

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

  return (
    <div>
      <div>
        {entry.date} {entry.description}
      </div>
      <ul>
        {diagnoses.map((d) => (
          <li key={d.code}>
            {d.code} {d.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntryInformation;

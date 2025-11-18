import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import diagnosis from '../../../services/diagnosis';
import { Diagnosis } from '../../../types';

const DiagnosisCodesSelector = () => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const fetched = await diagnosis.getAll();
      fetched.sort((a, b) => {
        if (a.code > b.code) return 1;
        if (a.code < b.code) return -1;
        return 0;
      });
      setDiagnoses(fetched);
    };

    fetchAll();
  }, []);

  if (diagnoses.length === 0) return null;

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;

    setSelectedDiagnoses(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl fullWidth style={{ marginTop: 20 }}>
      <InputLabel>Select diagnoses</InputLabel>
      <Select
        label="Select diagnoses"
        multiple
        value={selectedDiagnoses}
        onChange={handleChange}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return 'Select diagnoses';
          }
          return selected.join(', ');
        }}
      >
        {diagnoses.map((d) => (
          <MenuItem key={d.code} value={d.code}>
            [{d.code}] {d.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DiagnosisCodesSelector;

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { HealthCheckRating } from '../../../types';
import { useContext } from 'react';
import { FormContext } from './FormContextProvider';

const HealthCheckForm = () => {
  const healthCheckValues = Object.values(HealthCheckRating).filter(
    (v) => typeof v === 'number'
  ) as HealthCheckRating[];

  const { formData, setFormData } = useContext(FormContext)!;

  return (
    <FormControl fullWidth style={{ marginTop: 20 }}>
      <InputLabel>Health Check Rating</InputLabel>
      <Select
        label="Health Check Rating"
        value={formData['healthCheckRating'] ?? ''}
        required
        fullWidth
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            healthCheckRating: e.target.value,
          }))
        }
      >
        {healthCheckValues.map((v) => (
          <MenuItem value={v} key={v}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default HealthCheckForm;

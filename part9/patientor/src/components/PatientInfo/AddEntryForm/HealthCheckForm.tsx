import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { HealthCheckRating } from '../../../types';
import { useState } from 'react';

const HealthCheckForm = () => {
  const [healthCheckRating, setHealthCheckRating] = useState<string>('');
  const healthCheckValues = Object.values(HealthCheckRating).filter(
    (v) => typeof v === 'number'
  ) as HealthCheckRating[];

  return (
    <FormControl fullWidth style={{ marginTop: 20 }}>
      <InputLabel>Health Check Rating</InputLabel>
      <Select
        label="Health Check Rating"
        value={healthCheckRating}
        required
        fullWidth
        onChange={(event: SelectChangeEvent<string>) =>
          setHealthCheckRating(event.target.value)
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

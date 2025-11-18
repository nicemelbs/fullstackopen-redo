import { FormControl, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

const HospitalForm = () => {
  const [dischargeDate, setDischargeDate] = useState<Dayjs | null>(dayjs());
  const [criteria, setCriteria] = useState<string>('');
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormControl style={{ marginTop: 20 }}>
          <DatePicker
            label="Discharge date"
            value={dischargeDate}
            onChange={(newValue) => setDischargeDate(newValue)}
            format="YYYY-MM-DD"
          />
        </FormControl>
      </LocalizationProvider>
      <FormControl fullWidth style={{ marginTop: 20 }}>
        <TextField
          label="Criteria"
          variant="standard"
          value={criteria}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setCriteria(event.target.value)
          }
        />
      </FormControl>
    </>
  );
};

export default HospitalForm;

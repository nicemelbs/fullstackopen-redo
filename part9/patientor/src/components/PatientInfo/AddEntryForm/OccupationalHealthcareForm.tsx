import { Box, Button, FormControl, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

const OccupationalHealthcareForm = () => {
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeaveStart, setSickLeaveStart] = useState<Dayjs | null>(null);
  const [sickLeaveEnd, setSickLeaveEnd] = useState<Dayjs | null>(null);

  const [sickLeave, setSickLeave] = useState<boolean>(false);

  const handleSickLeaveToggle = () => {
    setSickLeave(!sickLeave);
    setSickLeaveStart(null);
    setSickLeaveEnd(null);
  };

  return (
    <>
      <FormControl fullWidth style={{ marginTop: 20 }}>
        <TextField
          value={employerName}
          label="Employer name"
          variant="standard"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEmployerName(event.target.value)
          }
        />
      </FormControl>

      <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
        <Button variant="contained" onClick={handleSickLeaveToggle}>
          {!sickLeave ? 'Add sick leave' : 'Remove sick leave'}
        </Button>
      </FormControl>

      {sickLeave && (
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl style={{ width: '50%' }}>
              <DatePicker
                label="Sick leave start"
                value={sickLeaveStart}
                onChange={(newValue) => setSickLeaveStart(newValue)}
                format="YYYY-MM-DD"
              />
            </FormControl>
            <FormControl style={{ width: '50%' }}>
              <DatePicker
                label="Sick leave end"
                value={sickLeaveEnd}
                minDate={sickLeaveStart ?? undefined}
                onChange={(newValue) => setSickLeaveEnd(newValue)}
                format="YYYY-MM-DD"
              />
            </FormControl>
          </LocalizationProvider>
        </Box>
      )}
    </>
  );
};

export default OccupationalHealthcareForm;

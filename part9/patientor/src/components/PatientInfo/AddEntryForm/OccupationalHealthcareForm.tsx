import { Box, Button, FormControl, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useContext, useState } from 'react';
import { FormContext } from './FormContextProvider';

const OccupationalHealthcareForm = () => {
  const [sickLeave, setSickLeave] = useState<boolean>(false);
  const { formData, setFormData } = useContext(FormContext)!;

  const handleSickLeaveToggle = () => {
    setSickLeave(!sickLeave);
    setFormData((prev) => ({
      ...prev,
      sickLeave: { startDate: null, endDate: null },
    }));
  };

  return (
    <>
      <FormControl fullWidth style={{ marginTop: 20 }}>
        <TextField
          value={formData['employerName'] ?? ''}
          label="Employer name"
          variant="standard"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({
              ...prev,
              employerName: event.target.value,
            }))
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
                value={formData['sickLeave']['startDate']}
                onChange={(newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    sickLeave: {
                      ...(prev['sickLeave'] ?? {}),
                      startDate: newValue,
                    },
                  }))
                }
                format="YYYY-MM-DD"
              />
            </FormControl>
            <FormControl style={{ width: '50%' }}>
              <DatePicker
                label="Sick leave end"
                value={formData['sickLeave']['endDate']}
                minDate={formData['sickLeave']['startDate'] ?? undefined}
                onChange={(newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    sickLeave: {
                      ...(prev['sickLeave'] ?? {}),
                      endDate: newValue,
                    },
                  }))
                }
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

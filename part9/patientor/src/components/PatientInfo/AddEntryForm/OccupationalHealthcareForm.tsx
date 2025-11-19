import { Box, Button, FormControl, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { FormContext } from './FormContextProvider';

const OccupationalHealthcareForm = () => {
  const [sickLeave, setSickLeave] = useState<boolean>(false);
  const { formData, setFormData } = useContext(FormContext)!;

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      employerName: '',
      sickLeave: {
        startDate: null,
        endDate: null,
      },
    }));
  }, [setFormData]);

  const handleSickLeaveToggle = () => {
    setSickLeave(!sickLeave);
    setFormData((prev) => ({
      ...prev,
      sickLeave: {
        startDate: null,
        endDate: null,
      },
    }));
  };

  const isSickLeave = (
    obj: unknown
  ): obj is { startDate?: Dayjs; endDate?: Dayjs } => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'startDate' in obj &&
      'endDate' in obj
    );
  };
  return (
    <>
      <FormControl fullWidth style={{ marginTop: 20 }}>
        <TextField
          value={formData['employerName']}
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
                value={
                  isSickLeave(formData['sickLeave'])
                    ? formData['sickLeave']['startDate']
                    : null
                }
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
                value={
                  isSickLeave(formData['sickLeave'])
                    ? formData['sickLeave']['endDate']
                    : null
                }
                minDate={
                  isSickLeave(formData['sickLeave']) &&
                  formData['sickLeave']['startDate']
                    ? formData['sickLeave']['startDate']
                    : undefined
                }
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

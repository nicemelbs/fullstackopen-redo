import { FormControl, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useContext, useEffect } from 'react';
import { FormContext } from './FormContextProvider';

const HospitalForm = () => {
  const { formData, setFormData } = useContext(FormContext)!;
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dischargeDate: dayjs(),
      criteria: '',
    }));
  }, [setFormData]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormControl style={{ marginTop: 20 }}>
          <DatePicker
            label="Discharge date"
            value={formData['dischargeDate'] ?? dayjs()}
            onChange={(newDate) =>
              setFormData((prev) => ({
                ...prev,
                dischargeDate: newDate,
              }))
            }
            format="YYYY-MM-DD"
          />
        </FormControl>
      </LocalizationProvider>
      <FormControl fullWidth style={{ marginTop: 20 }}>
        <TextField
          label="Criteria"
          variant="standard"
          value={formData['criteria'] ?? ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({
              ...prev,
              criteria: event.target.value,
            }))
          }
        />
      </FormControl>
    </>
  );
};

export default HospitalForm;

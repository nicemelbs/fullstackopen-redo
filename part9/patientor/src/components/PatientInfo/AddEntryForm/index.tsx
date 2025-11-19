import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import { useContext, useEffect } from 'react';
import { EntryType } from '../../../types';
import HealthCheckForm from './HealthCheckForm';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import DiagnosisCodesSelector from './DiagnosisCodesSelector';
import OccupationalHealthcareForm from './OccupationalHealthcareForm';
import HospitalForm from './HostpitalForm';
import { FormContext } from './FormContextProvider';

interface Props {
  isVisible: boolean;
}
const AddEntryForm = (props: Props) => {
  const { isVisible } = props;
  const entryTypeValues = Object.values(EntryType) as EntryType[];
  const { formData, setFormData } = useContext(FormContext)!;

  //initialize formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      entryType: EntryType.HealthCheck,
      entryDate: dayjs(),
    }));
  }, [setFormData]);

  if (!isVisible) return null;

  const otherFormFields = (type: EntryType) => {
    switch (type) {
      case EntryType.HealthCheck:
        return <HealthCheckForm />;
      case EntryType.Hospital:
        return <HospitalForm />;
      case EntryType.OccupationalHealthcare:
        return <OccupationalHealthcareForm />;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('form submitted', formData);
  };

  return (
    <Container
      style={{
        marginTop: 25,
        marginBottom: 25,
        border: '2px dotted',
        padding: 25,
      }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl style={{ width: '50%' }}>
          <InputLabel>Entry Type</InputLabel>
          <Select
            label="Entry type"
            // value={entryType}
            value={formData['entryType']}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, entryType: e.target.value }))
            }
          >
            {entryTypeValues.map((v) => (
              <MenuItem value={v} key={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ width: '50%', marginBottom: 20 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={formData['entryDate'] as Dayjs}
              onChange={(newValue) =>
                setFormData((prev) => ({ ...prev, entryDate: newValue }))
              }
              maxDate={dayjs()}
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl fullWidth>
          <TextField variant="standard" required label="Description" />
        </FormControl>
        <FormControl fullWidth style={{ marginTop: 15 }}></FormControl>
        <FormControl fullWidth>
          <TextField variant="standard" required label="Specialist" />
        </FormControl>
        {otherFormFields(
          (formData['entryType'] ?? EntryType.HealthCheck) as EntryType
        )}

        <DiagnosisCodesSelector />

        <Grid style={{ marginTop: 20, marginBottom: 50 }}>
          <Grid item>
            <Button
              style={{ float: 'right' }}
              type="submit"
              variant="contained"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddEntryForm;

import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

import { useState } from 'react';
import { EntryType } from '../../../types';
import HealthCheckForm from './HealthCheckForm';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import DiagnosisCodesSelector from './DiagnosisCodesSelector';
import OccupationalHealthcareForm from './OccupationalHealthcareForm';
import HospitalForm from './HostpitalForm';

interface Props {
  isVisible: boolean;
}
const AddEntryForm = (props: Props) => {
  const { isVisible } = props;
  const [entryType, setEntryType] = useState<EntryType>(EntryType.Hospital);
  const currentDate = dayjs();
  const [entryDate, setEntryDate] = useState<Dayjs | null>(currentDate);

  const entryTypeValues = Object.values(EntryType) as EntryType[];
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
    console.log('form submitted');
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
            value={entryType}
            onChange={(event: SelectChangeEvent<EntryType>) =>
              setEntryType(event.target.value as EntryType)
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
              value={entryDate}
              onChange={(newValue) => setEntryDate(newValue)}
              maxDate={currentDate}
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
        {otherFormFields(entryType)}

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

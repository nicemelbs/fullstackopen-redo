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
import {
  Entry,
  EntryFormFields,
  EntryType,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from '../../../types';
import HealthCheckForm from './HealthCheckForm';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import DiagnosisCodesSelector from './DiagnosisCodesSelector';
import OccupationalHealthcareForm from './OccupationalHealthcareForm';
import HospitalForm from './HostpitalForm';
import { FormContext } from './FormContext';
import patients from '../../../services/patients';
import { assertNever } from '../../../utils';

interface Props {
  isVisible: boolean;
  patientId: string;
  handleNewEntry: (newEntry: Entry) => void;
}
const AddEntryForm = (props: Props) => {
  const { isVisible, patientId, handleNewEntry } = props;
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validForm(formData)) {
      const cleanData = reshapeFormData(formData);

      const newEntry = await patients.addEntryToPatient(patientId, cleanData);
      handleNewEntry(newEntry);
    }
  };

  const validForm = (data: unknown): data is EntryFormFields => {
    return (
      data !== null &&
      typeof data === 'object' &&
      'entryType' in data &&
      typeof data.entryType === 'string' &&
      'description' in data &&
      typeof data.description === 'string' &&
      'entryDate' in data &&
      typeof data.entryDate === 'object' &&
      'specialist' in data &&
      typeof data.specialist === 'string' &&
      'diagnoses' in data &&
      data.diagnoses instanceof Array
    );
  };
  const reshapeFormData = (data: EntryFormFields): Omit<Entry, 'id'> => {
    //check fields
    let reshapedFormData: Omit<Entry, 'id'> = {
      type: data.entryType,
      date: dayjs(data.entryDate).format('YYYY-MM-DD'),
      description: data.description,
      specialist: data.specialist,
      diagnosisCodes: data.diagnoses ?? undefined,
    };

    switch (reshapedFormData.type) {
      case EntryType.HealthCheck:
        reshapedFormData = {
          ...reshapedFormData,
          healthCheckRating: Number(data.healthCheckRating),
        } as HealthCheckEntry;

        break;

      case EntryType.Hospital:
        reshapedFormData = {
          ...reshapedFormData,
          discharge: {
            date: dayjs(data.dischargeDate).format('YYYY-MM-DD'),
            criteria: data.criteria,
          },
        } as HospitalEntry;
        break;
      case EntryType.OccupationalHealthcare:
        reshapedFormData = {
          ...reshapedFormData,
          employerName: data.employerName ?? undefined,
          sickLeave:
            data.sickLeave &&
            data.sickLeave.startDate !== null &&
            data.sickLeave.endDate !== null
              ? {
                  startDate: dayjs(data.sickLeave.startDate).format(
                    'YYYY-MM-DD'
                  ),

                  endDate: dayjs(data.sickLeave.endDate).format('YYYY-MM-DD'),
                }
              : undefined,
        } as OccupationalHealthcareEntry;
        break;

      default:
        assertNever(reshapedFormData.type);
    }

    return reshapedFormData;
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
            value={formData['entryType']}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                entryType: e.target.value as EntryType,
              }))
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
              value={formData['entryDate']}
              onChange={(newValue) =>
                setFormData((prev) => ({
                  ...prev,
                  entryDate: newValue as Dayjs,
                }))
              }
              maxDate={dayjs()}
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            variant="standard"
            value={formData['description']}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            required
            label="Description"
          />
        </FormControl>
        <FormControl fullWidth style={{ marginTop: 15 }}></FormControl>
        <FormControl fullWidth>
          <TextField
            value={formData['specialist'] ?? ''}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                specialist: event.target.value,
              }))
            }
            variant="standard"
            required
            label="Specialist"
          />
        </FormControl>
        {otherFormFields(formData['entryType'])}

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

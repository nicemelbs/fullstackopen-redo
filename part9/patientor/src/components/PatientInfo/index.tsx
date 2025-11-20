import { useMatch } from 'react-router-dom';
import patients from '../../services/patients';
import { useEffect, useState } from 'react';
import { Entry, Patient } from '../../types';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EntriesList from '../EntriesList';
import { Button, Container, Divider, Typography } from '@mui/material';
import AddEntryForm from './AddEntryForm';
import FormContextProvider from './AddEntryForm/FormContextProvider';
import Notification from '../Notification';
const PatientInfo = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const match = useMatch('patients/:id');

  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [entries, setEntries] = useState<Entry[]>([]);

  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [notificationSeverity, setNotificationSeverity] = useState<
    'success' | 'error'
  >('success');
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);

  useEffect(() => {
    if (match) {
      const fetchPatient = async () => {
        if (match.params.id) {
          const p = await patients.getOneById(match.params.id);

          setPatient(p);
          setEntries(p.entries);
        }
      };
      fetchPatient();
    }
  }, [match]);

  const getGenderIcon = (gender: string) => {
    let genderIcon = null;
    switch (gender) {
      case 'male':
        genderIcon = <MaleIcon />;
        break;
      case 'female':
        genderIcon = <FemaleIcon />;
        break;
      default:
        genderIcon = <PersonOutlineIcon />;
    }

    return <span title={gender}>{genderIcon}</span>;
  };

  if (!patient) {
    return <div>No matching entry.</div>;
  }

  const handleNewEntry = (newEntry: Entry) => {
    setEntries(entries.concat(newEntry));
  };

  const displaySuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setNotificationSeverity('success');
    setNotificationOpen(true);
  };

  const displayErrorNotification = (message: string) => {
    setNotificationMessage(message);
    setNotificationSeverity('error');
    setNotificationOpen(true);
  };
  return (
    <Container style={{ marginTop: '0.5em' }}>
      <Notification
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        onClose={() => setNotificationOpen(false)}
      />
      <Divider hidden />
      <Typography variant="h4">
        {patient.name} <span>{getGenderIcon(patient.gender)}</span>
      </Typography>

      {!formVisible && (
        <Button variant="contained" onClick={() => setFormVisible(true)}>
          Add new entry
        </Button>
      )}

      {/* {formVisible && (
        <Button onClick={() => setFormVisible(false)} variant="contained">
          Cancel
        </Button>
      )} */}

      <FormContextProvider>
        <AddEntryForm
          handleNewEntry={handleNewEntry}
          hideForm={() => setFormVisible(false)}
          isVisible={formVisible}
          patientId={patient.id}
          notifyError={displayErrorNotification}
          notifySuccess={displaySuccessNotification}
        />
      </FormContextProvider>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <EntriesList entries={entries} />
    </Container>
  );
};

export default PatientInfo;

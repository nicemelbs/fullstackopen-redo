import {
  NewPatientEntry,
  Patient,
  PatientEntry,
  PatientEntryWithoutSsn,
} from '../types';
import patients from '../../data/patients';
import { v4 } from 'uuid';

const getPatients = (): PatientEntryWithoutSsn[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatientEntry): PatientEntry => {
  const id = v4();
  const newPatientEntry = {
    id,
    entries: [],
    ...patient,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const getOneById = (id: string): Patient | undefined => {
  const foundPatient = patients.find((p) => p.id === id);
  foundPatient?.entries.forEach((e) => {
    switch (e.type) {
      case 'HealthCheck':
        break;
      case 'Hospital':
        break;
      case 'OccupationalHealthcare':
        break;
      default:
        throw new Error('unknown type');
    }
  });

  return foundPatient;
};

export default {
  getPatients,
  addPatient,
  getOneById,
};

import {
  DiagnosisEntry,
  Entry,
  EntryType,
  NewEntry,
  NewPatientEntry,
  Patient,
  PatientEntry,
  PatientEntryWithoutSsn,
} from '../types';
import patients from '../../data/patients';
import { v4 } from 'uuid';
import {
  NewHealthCheckEntrySchema,
  NewHospitalEntrySchema,
  NewOccupationalHealthcareEntrySchema,
} from '../utils';

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
      case EntryType.HealthCheck:
        break;
      case EntryType.Hospital:
        break;
      case EntryType.OccupationalHealthcare:
        break;
      default:
        throw new Error('unknown type');
    }
  });

  return foundPatient;
};

const parseDiagnosisCodes = (
  object: unknown
): Array<DiagnosisEntry['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<DiagnosisEntry['code']>;
  }

  return object.diagnosisCodes as Array<DiagnosisEntry['code']>;
};
const addEntryToPatient = (
  patientId: string,
  entry: NewEntry
): Patient | undefined => {
  const foundPatient = patients.find((p) => p.id === patientId);

  if (!foundPatient) return undefined;

  entry.diagnosisCodes = parseDiagnosisCodes(entry);
  switch (entry.type) {
    case EntryType.Hospital:
      NewHospitalEntrySchema.parse(entry);
      break;
    case EntryType.HealthCheck:
      NewHealthCheckEntrySchema.parse(entry);
      break;
    case EntryType.OccupationalHealthcare:
      NewOccupationalHealthcareEntrySchema.parse(entry);
      break;
  }

  const completedEntry = { ...entry, id: v4() } as Entry;

  foundPatient.entries.push(completedEntry);

  return foundPatient;
};

export default {
  getPatients,
  addPatient,
  getOneById,
  addEntryToPatient,
};

import axios from 'axios';
import { Entry, Patient, PatientFormValues } from '../types';

import { apiBaseUrl } from '../constants';

const getAll = async (): Promise<Patient[]> => {
  const response = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);
  return response.data;
};

const getOneById = async (id: string): Promise<Patient> => {
  const response = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return response.data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const addEntryToPatient = async (
  patientId: string,
  object: Omit<Entry, 'id'>
): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    object
  );

  return data;
};

export default {
  getAll,
  create,
  getOneById,
  addEntryToPatient,
};

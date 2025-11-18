import axios from 'axios';
import { Diagnosis } from '../types';
import { apiBaseUrl } from '../constants';

const getOneByCode = async (code: string): Promise<Diagnosis> => {
  const response = await axios.get<Diagnosis>(
    `${apiBaseUrl}/diagnoses/${code}`
  );
  return response.data;
};

const getMany = async (codes: string[]): Promise<Diagnosis[]> => {
  const codesString = codes.join(',');
  const response = await axios.get<Diagnosis[]>(
    `${apiBaseUrl}/diagnoses/many/${codesString}`
  );

  return response.data;
};

const getAll = async (): Promise<Diagnosis[]> => {
  const response = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);

  return response.data;
};

export default { getOneByCode, getMany, getAll };

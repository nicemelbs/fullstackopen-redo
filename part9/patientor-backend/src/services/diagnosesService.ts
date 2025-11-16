import diagnoses from '../../data/diagnoses';
import { DiagnosisEntry } from '../types';

const getDiagnoses = (): DiagnosisEntry[] => {
  return diagnoses;
};

const getOneByCode = (code: string): DiagnosisEntry | undefined => {
  return diagnoses.find((d) => d.code === code);
};

const getMany = (codes: string[]): DiagnosisEntry[] => {
  return diagnoses.filter((d) => codes.includes(d.code));
};

export default {
  getDiagnoses,
  getOneByCode,
  getMany,
};

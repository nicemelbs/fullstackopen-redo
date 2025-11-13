import z from 'zod';
import { NewPatientSchema } from './utils';

export interface DiagnosisEntry {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = 'male',
  Other = 'other',
  Female = 'female',
}

export type NewPatientEntry = z.infer<typeof NewPatientSchema>;
export interface PatientEntry extends NewPatientEntry {
  id: string;
}
export type PatientEntryWithoutSsn = Omit<PatientEntry, 'ssn'>;

export interface DiagnosisEntry {
  code: string;
  name: string;
  latin?: string;
}

export type Gender = 'male' | 'female' | 'other';
export interface PatientEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  ssn: string;
  occupation: string;
}

export type PatientEntryWithoutSsn = Omit<PatientEntry, 'ssn'>;

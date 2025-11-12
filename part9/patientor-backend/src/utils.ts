import { Gender, NewPatientEntry } from './types';
const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object != 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object &&
    'dateOfBirth' in object
  ) {
    const newPatientEntry: NewPatientEntry = {
      name: parseString(object.name, 'name'),
      ssn: parseString(object.ssn, 'ssn'),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation, 'occupation'),
    };

    return newPatientEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (text: unknown, field: string): string => {
  if (!isString(text)) {
    throw new Error(`Incorrect or missing ${field}`);
  }
  return text;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Date is either missing or in wrong format.' + date);
  }
  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((g) => g.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

export default toNewPatientEntry;

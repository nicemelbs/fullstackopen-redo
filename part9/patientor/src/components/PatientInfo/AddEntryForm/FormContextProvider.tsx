import { ReactNode, useState } from 'react';
import { EntryFormFields, EntryType } from '../../../types';
import { FormContext } from './FormContext';
import dayjs from 'dayjs';

interface Props {
  children: ReactNode;
}

const FormContextProvider = ({ children }: Props) => {
  const [formData, setFormData] = useState<EntryFormFields>({
    entryType: EntryType.HealthCheck,
    entryDate: dayjs(),
    specialist: '',
    description: '',
    sickLeave: { startDate: null, endDate: null },
    dischargeDate: null,
    criteria: '',
    employerName: '',
    healthCheckRating: null,
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export default FormContextProvider;

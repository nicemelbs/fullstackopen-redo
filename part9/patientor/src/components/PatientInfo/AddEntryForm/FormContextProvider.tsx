import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { EntryFormFields, EntryType } from '../../../types';
import dayjs from 'dayjs';

interface Props {
  children: ReactNode;
}

interface FormContextType {
  formData: EntryFormFields;
  setFormData: Dispatch<SetStateAction<EntryFormFields>>;
}

export const FormContext = createContext<FormContextType | null>(null);
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

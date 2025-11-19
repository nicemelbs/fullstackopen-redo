import { Dispatch, SetStateAction, createContext } from 'react';
import { EntryFormFields } from '../../../types';

interface FormContextType {
  formData: EntryFormFields;
  setFormData: Dispatch<SetStateAction<EntryFormFields>>;
}

export const FormContext = createContext<FormContextType | null>(null);

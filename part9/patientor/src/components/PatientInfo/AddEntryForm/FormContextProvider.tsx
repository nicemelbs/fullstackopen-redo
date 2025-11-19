import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

interface Props {
  children: ReactNode;
}

interface FormContextType {
  formData: Record<string, unknown>;
  setFormData: Dispatch<SetStateAction<Record<string, unknown>>>;
}

export const FormContext = createContext<FormContextType | null>(null);
const FormContextProvider = ({ children }: Props) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export default FormContextProvider;

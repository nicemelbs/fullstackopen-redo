import { useMatch } from 'react-router-dom';
import patients from '../../services/patients';
import { useEffect, useState } from 'react';
import { Patient } from '../../types';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EntriesList from '../EntriesList';
const PatientInfo = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const match = useMatch('patients/:id');

  useEffect(() => {
    if (match) {
      const fetchPatient = async () => {
        if (match.params.id) {
          const p = await patients.getOneById(match.params.id);
          setPatient(p);
        }
      };
      fetchPatient();
    }
  }, [match]);

  const getGenderIcon = (gender: string) => {
    let genderIcon = null;
    switch (gender) {
      case 'male':
        genderIcon = <MaleIcon />;
        break;
      case 'female':
        genderIcon = <FemaleIcon />;
        break;
      default:
        genderIcon = <PersonOutlineIcon />;
    }

    return <span title={gender}>{genderIcon}</span>;
  };

  if (!patient) {
    return <div>No matching entry.</div>;
  }
  return (
    <div>
      <h2>
        {patient.name} <span>{getGenderIcon(patient.gender)}</span>
      </h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <EntriesList entries={patient.entries} />
    </div>
  );
};

export default PatientInfo;

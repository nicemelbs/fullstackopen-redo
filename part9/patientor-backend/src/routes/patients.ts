import express, { Response } from 'express';
import { PatientEntryWithoutSsn } from '../../types';
import patientsService from '../services/patientsService';
const router = express.Router();

router.get('/', (_req, res: Response<PatientEntryWithoutSsn[]>) => {
  res.send(patientsService.getPatients());
});

export default router;

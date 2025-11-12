import express from 'express';
import { Response } from 'express';
import { DiagnosisEntry } from '../../types';
import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res: Response<DiagnosisEntry[]>) => {
  res.send(diagnosesService.getDiagnoses());
});

export default router;

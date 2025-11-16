import express from 'express';
import { Request, Response } from 'express';
import { DiagnosisEntry } from '../types';
import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res: Response<DiagnosisEntry[]>) => {
  res.send(diagnosesService.getDiagnoses());
});

router.get(
  '/:code',
  (req: Request<{ code: string }>, res: Response<DiagnosisEntry>) => {
    const code = req.params.code;
    const diagnosis = diagnosesService.getOneByCode(code);
    res.send(diagnosis);
  }
);

router.get(
  '/many/:codes',
  (req: Request<{ codes: string }>, res: Response<DiagnosisEntry[]>) => {
    const codes = req.params.codes.split(',');
    const foundDiagnoses = diagnosesService.getMany(codes);

    res.send(foundDiagnoses);
  }
);

export default router;

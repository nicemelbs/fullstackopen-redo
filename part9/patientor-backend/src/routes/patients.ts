import express, { NextFunction, Request, Response } from 'express';
import {
  NewPatientEntry,
  PatientEntry,
  PatientEntryWithoutSsn,
} from '../types';
import patientsService from '../services/patientsService';
import { NewPatientSchema } from '../utils';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<PatientEntryWithoutSsn[]>) => {
  res.send(patientsService.getPatients());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else next(error);
};

router.post(
  '/',
  newPatientParser,
  (
    req: Request<unknown, unknown, NewPatientEntry>,
    res: Response<PatientEntry>
  ) => {
    const addedPatient = patientsService.addPatient(req.body);
    res.json(addedPatient);
  }
);
router.use(errorMiddleware);
export default router;

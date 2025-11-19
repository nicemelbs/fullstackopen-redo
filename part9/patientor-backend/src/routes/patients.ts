import express, { NextFunction, Request, Response } from 'express';
import {
  Entry,
  NewEntry,
  NewPatientEntry,
  Patient,
  PatientEntry,
  PatientEntryWithoutSsn,
} from '../types';
import patientsService from '../services/patientsService';
import { NewEntrySchema, NewPatientSchema } from '../utils';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<PatientEntryWithoutSsn[]>) => {
  res.send(patientsService.getPatients());
});

router.get('/:id', (req: Request, res: Response<Patient>) => {
  const id = req.params.id;
  const patient = patientsService.getOneById(id);

  if (patient) {
    res.send(patient);
  } else res.status(404).send(undefined);
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
const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  '/:id/entries',
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, NewEntry>,
    res: Response<Entry | undefined>
  ) => {
    const patientId = req.params.id;

    const entryToAdd = req.body;

    const newEntry = patientsService.addEntryToPatient(patientId, entryToAdd);

    res.status(201).send(newEntry);
  }
);

router.use(errorMiddleware);
export default router;

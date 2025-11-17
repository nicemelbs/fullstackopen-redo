import z from 'zod';
import { EntryType, Gender, HealthCheckRating } from './types';

export const NewPatientSchema = z.object({
  name: z.string(),
  ssn: z.string(),
  dateOfBirth: z.iso.date(),
  gender: z.enum(Gender),
  occupation: z.string(),
});

export const NewEntrySchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  type: z.enum(EntryType),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const NewHealthCheckEntrySchema = NewEntrySchema.extend({
  type: z.literal(EntryType.HealthCheck),
  healthCheckRating: z.enum(HealthCheckRating),
});

export const NewHospitalEntrySchema = NewEntrySchema.extend({
  type: z.literal(EntryType.Hospital),
  discharge: z.object({ date: z.iso.date(), criteria: z.string() }),
});

export const NewOccupationalHealthcareEntrySchema = NewEntrySchema.extend({
  type: z.literal(EntryType.OccupationalHealthcare),
  employerName: z.string().optional(),
  sickLeave: z
    .object({ startDate: z.iso.date(), endDate: z.iso.date() })
    .optional(),
});

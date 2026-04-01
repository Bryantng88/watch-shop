import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  serviceRequestId: z.literal(true).optional(),
  movementKind: z.literal(true).optional(),
  runningOk: z.literal(true).optional(),
  batteryWeak: z.literal(true).optional(),
  batteryIssueBattery: z.literal(true).optional(),
  batteryIssueIC: z.literal(true).optional(),
  batteryIssueCoil: z.literal(true).optional(),
  preRate: z.literal(true).optional(),
  preAmplitude: z.literal(true).optional(),
  preBeatError: z.literal(true).optional(),
  postRate: z.literal(true).optional(),
  postAmplitude: z.literal(true).optional(),
  postBeatError: z.literal(true).optional(),
  actionMode: z.literal(true).optional(),
  vendorId: z.literal(true).optional(),
  vendorNameSnap: z.literal(true).optional(),
  diagnosis: z.literal(true).optional(),
  conclusion: z.literal(true).optional(),
  imageFileKey: z.literal(true).optional(),
  status: z.literal(true).optional(),
  evaluatedById: z.literal(true).optional(),
  evaluatedByNameSnap: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const TechnicalAssessmentMaxAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentMaxAggregateInputType>;
export const TechnicalAssessmentMaxAggregateInputObjectZodSchema = makeSchema();

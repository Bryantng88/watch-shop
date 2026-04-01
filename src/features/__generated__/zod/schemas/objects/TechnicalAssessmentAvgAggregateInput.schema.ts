import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  preRate: z.literal(true).optional(),
  preAmplitude: z.literal(true).optional(),
  preBeatError: z.literal(true).optional(),
  postRate: z.literal(true).optional(),
  postAmplitude: z.literal(true).optional(),
  postBeatError: z.literal(true).optional()
}).strict();
export const TechnicalAssessmentAvgAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentAvgAggregateInputType>;
export const TechnicalAssessmentAvgAggregateInputObjectZodSchema = makeSchema();

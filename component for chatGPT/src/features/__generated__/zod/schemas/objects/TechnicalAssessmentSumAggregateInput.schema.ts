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
export const TechnicalAssessmentSumAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentSumAggregateInputType>;
export const TechnicalAssessmentSumAggregateInputObjectZodSchema = makeSchema();

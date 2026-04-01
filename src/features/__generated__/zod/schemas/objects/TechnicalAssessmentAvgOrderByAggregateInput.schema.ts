import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  preRate: SortOrderSchema.optional(),
  preAmplitude: SortOrderSchema.optional(),
  preBeatError: SortOrderSchema.optional(),
  postRate: SortOrderSchema.optional(),
  postAmplitude: SortOrderSchema.optional(),
  postBeatError: SortOrderSchema.optional()
}).strict();
export const TechnicalAssessmentAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentAvgOrderByAggregateInput>;
export const TechnicalAssessmentAvgOrderByAggregateInputObjectZodSchema = makeSchema();

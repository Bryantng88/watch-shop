import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TechnicalAssessmentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentOrderByRelationAggregateInput>;
export const TechnicalAssessmentOrderByRelationAggregateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  appearanceScore: SortOrderSchema.optional(),
  caseScore: SortOrderSchema.optional(),
  glassScore: SortOrderSchema.optional(),
  dialScore: SortOrderSchema.optional(),
  caseManualDeduction: SortOrderSchema.optional(),
  glassManualDeduction: SortOrderSchema.optional(),
  dialManualDeduction: SortOrderSchema.optional(),
  crownCost: SortOrderSchema.optional(),
  movementCost: SortOrderSchema.optional(),
  crownCostTotal: SortOrderSchema.optional(),
  cosmeticProposalCost: SortOrderSchema.optional(),
  totalCost: SortOrderSchema.optional()
}).strict();
export const technicalAssessmentsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsAvgOrderByAggregateInput>;
export const technicalAssessmentsAvgOrderByAggregateInputObjectZodSchema = makeSchema();

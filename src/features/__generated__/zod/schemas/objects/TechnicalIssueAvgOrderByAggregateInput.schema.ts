import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  estimatedCost: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TechnicalIssueAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalIssueAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueAvgOrderByAggregateInput>;
export const TechnicalIssueAvgOrderByAggregateInputObjectZodSchema = makeSchema();

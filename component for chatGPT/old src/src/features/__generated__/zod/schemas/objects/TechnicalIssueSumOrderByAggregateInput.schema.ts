import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  estimatedCost: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  actualCost: SortOrderSchema.optional()
}).strict();
export const TechnicalIssueSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalIssueSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueSumOrderByAggregateInput>;
export const TechnicalIssueSumOrderByAggregateInputObjectZodSchema = makeSchema();

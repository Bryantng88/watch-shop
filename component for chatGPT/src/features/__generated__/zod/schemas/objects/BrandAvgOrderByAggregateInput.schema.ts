import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  foundedYear: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional()
}).strict();
export const BrandAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BrandAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandAvgOrderByAggregateInput>;
export const BrandAvgOrderByAggregateInputObjectZodSchema = makeSchema();

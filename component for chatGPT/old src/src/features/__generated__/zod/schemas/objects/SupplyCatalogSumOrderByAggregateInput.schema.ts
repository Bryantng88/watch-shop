import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  defaultCost: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional()
}).strict();
export const SupplyCatalogSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SupplyCatalogSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogSumOrderByAggregateInput>;
export const SupplyCatalogSumOrderByAggregateInputObjectZodSchema = makeSchema();

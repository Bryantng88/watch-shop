import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  defaultCost: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional()
}).strict();
export const SupplyCatalogAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SupplyCatalogAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogAvgOrderByAggregateInput>;
export const SupplyCatalogAvgOrderByAggregateInputObjectZodSchema = makeSchema();

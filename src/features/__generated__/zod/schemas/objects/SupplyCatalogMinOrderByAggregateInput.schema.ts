import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  unit: SortOrderSchema.optional(),
  defaultCost: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const SupplyCatalogMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SupplyCatalogMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogMinOrderByAggregateInput>;
export const SupplyCatalogMinOrderByAggregateInputObjectZodSchema = makeSchema();

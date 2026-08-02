import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  kind: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  colorHex: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const StrapCatalogOptionMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionMaxOrderByAggregateInput>;
export const StrapCatalogOptionMaxOrderByAggregateInputObjectZodSchema = makeSchema();

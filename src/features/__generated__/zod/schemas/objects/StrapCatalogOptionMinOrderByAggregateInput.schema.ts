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
export const StrapCatalogOptionMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionMinOrderByAggregateInput>;
export const StrapCatalogOptionMinOrderByAggregateInputObjectZodSchema = makeSchema();

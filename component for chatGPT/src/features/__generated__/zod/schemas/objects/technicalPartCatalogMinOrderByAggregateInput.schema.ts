import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  appliesTo: SortOrderSchema.optional(),
  partGroup: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const technicalPartCatalogMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.technicalPartCatalogMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalPartCatalogMinOrderByAggregateInput>;
export const technicalPartCatalogMinOrderByAggregateInputObjectZodSchema = makeSchema();

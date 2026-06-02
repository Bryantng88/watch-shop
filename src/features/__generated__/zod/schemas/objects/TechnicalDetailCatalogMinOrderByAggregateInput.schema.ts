import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  area: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TechnicalDetailCatalogMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogMinOrderByAggregateInput>;
export const TechnicalDetailCatalogMinOrderByAggregateInputObjectZodSchema = makeSchema();

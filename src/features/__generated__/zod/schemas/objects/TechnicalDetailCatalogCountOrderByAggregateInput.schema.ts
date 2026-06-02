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
export const TechnicalDetailCatalogCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCountOrderByAggregateInput>;
export const TechnicalDetailCatalogCountOrderByAggregateInputObjectZodSchema = makeSchema();

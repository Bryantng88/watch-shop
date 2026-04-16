import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  area: SortOrderSchema.optional(),
  label: SortOrderSchema.optional(),
  deductionScore: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const technicalAppearanceIssueCatalogMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogMaxOrderByAggregateInput>;
export const technicalAppearanceIssueCatalogMaxOrderByAggregateInputObjectZodSchema = makeSchema();

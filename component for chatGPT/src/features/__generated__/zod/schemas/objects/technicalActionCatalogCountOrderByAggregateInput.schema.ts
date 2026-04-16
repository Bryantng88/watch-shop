import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  appliesTo: SortOrderSchema.optional(),
  groupKey: SortOrderSchema.optional(),
  requiresPart: SortOrderSchema.optional(),
  defaultExecutionMode: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const technicalActionCatalogCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.technicalActionCatalogCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalActionCatalogCountOrderByAggregateInput>;
export const technicalActionCatalogCountOrderByAggregateInputObjectZodSchema = makeSchema();

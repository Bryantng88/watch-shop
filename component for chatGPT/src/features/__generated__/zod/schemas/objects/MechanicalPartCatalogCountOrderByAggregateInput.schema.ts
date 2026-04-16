import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  group: SortOrderSchema.optional(),
  defaultCost: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const MechanicalPartCatalogCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCountOrderByAggregateInput>;
export const MechanicalPartCatalogCountOrderByAggregateInputObjectZodSchema = makeSchema();

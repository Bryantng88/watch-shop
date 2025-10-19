import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  productId: SortOrderSchema.optional(),
  model: SortOrderSchema.optional(),
  year: SortOrderSchema.optional(),
  caseType: SortOrderSchema.optional(),
  gender: SortOrderSchema.optional(),
  length: SortOrderSchema.optional(),
  sizeCategory: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  thickness: SortOrderSchema.optional(),
  movement: SortOrderSchema.optional(),
  caliber: SortOrderSchema.optional(),
  caseMaterial: SortOrderSchema.optional(),
  goldKarat: SortOrderSchema.optional(),
  goldColor: SortOrderSchema.optional(),
  caseSize: SortOrderSchema.optional(),
  dialColor: SortOrderSchema.optional(),
  marketSegmentId: SortOrderSchema.optional(),
  strap: SortOrderSchema.optional(),
  glass: SortOrderSchema.optional(),
  boxIncluded: SortOrderSchema.optional(),
  bookletIncluded: SortOrderSchema.optional(),
  cardIncluded: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WatchSpecMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchSpecMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecMaxOrderByAggregateInput>;
export const WatchSpecMaxOrderByAggregateInputObjectZodSchema = makeSchema();

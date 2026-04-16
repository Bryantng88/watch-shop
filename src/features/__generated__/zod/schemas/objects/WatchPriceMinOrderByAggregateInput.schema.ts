import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  costPrice: SortOrderSchema.optional(),
  serviceCost: SortOrderSchema.optional(),
  landedCost: SortOrderSchema.optional(),
  listPrice: SortOrderSchema.optional(),
  salePrice: SortOrderSchema.optional(),
  minPrice: SortOrderSchema.optional(),
  pricingNote: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WatchPriceMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchPriceMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceMinOrderByAggregateInput>;
export const WatchPriceMinOrderByAggregateInputObjectZodSchema = makeSchema();

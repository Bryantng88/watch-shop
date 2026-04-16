import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  costPrice: SortOrderSchema.optional(),
  serviceCost: SortOrderSchema.optional(),
  landedCost: SortOrderSchema.optional(),
  listPrice: SortOrderSchema.optional(),
  salePrice: SortOrderSchema.optional(),
  minPrice: SortOrderSchema.optional()
}).strict();
export const WatchPriceSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchPriceSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceSumOrderByAggregateInput>;
export const WatchPriceSumOrderByAggregateInputObjectZodSchema = makeSchema();

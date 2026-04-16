import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  costPrice: z.literal(true).optional(),
  serviceCost: z.literal(true).optional(),
  landedCost: z.literal(true).optional(),
  listPrice: z.literal(true).optional(),
  salePrice: z.literal(true).optional(),
  minPrice: z.literal(true).optional()
}).strict();
export const WatchPriceSumAggregateInputObjectSchema: z.ZodType<Prisma.WatchPriceSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceSumAggregateInputType>;
export const WatchPriceSumAggregateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  watchId: z.literal(true).optional(),
  costPrice: z.literal(true).optional(),
  serviceCost: z.literal(true).optional(),
  landedCost: z.literal(true).optional(),
  listPrice: z.literal(true).optional(),
  salePrice: z.literal(true).optional(),
  minPrice: z.literal(true).optional(),
  pricingNote: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const WatchPriceMinAggregateInputObjectSchema: z.ZodType<Prisma.WatchPriceMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceMinAggregateInputType>;
export const WatchPriceMinAggregateInputObjectZodSchema = makeSchema();

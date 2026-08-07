import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  listPriceSnapshot: z.literal(true).optional(),
  quantity: z.literal(true).optional()
}).strict();
export const PurchaseRequestItemAvgAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemAvgAggregateInputType>;
export const PurchaseRequestItemAvgAggregateInputObjectZodSchema = makeSchema();

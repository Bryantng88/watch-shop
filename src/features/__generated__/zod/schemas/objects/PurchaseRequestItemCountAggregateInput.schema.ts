import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  purchaseRequestId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  titleSnapshot: z.literal(true).optional(),
  listPriceSnapshot: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const PurchaseRequestItemCountAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCountAggregateInputType>;
export const PurchaseRequestItemCountAggregateInputObjectZodSchema = makeSchema();

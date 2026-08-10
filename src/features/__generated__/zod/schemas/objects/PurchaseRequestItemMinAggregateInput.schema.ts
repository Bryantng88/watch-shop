import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  purchaseRequestId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  titleSnapshot: z.literal(true).optional(),
  listPriceSnapshot: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  decision: z.literal(true).optional(),
  agreedPrice: z.literal(true).optional(),
  decisionReason: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const PurchaseRequestItemMinAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemMinAggregateInputType>;
export const PurchaseRequestItemMinAggregateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  requestKey: z.literal(true).optional(),
  requestHash: z.literal(true).optional(),
  purchaseRequestId: z.literal(true).optional(),
  disposition: z.literal(true).optional(),
  addedItemCount: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const PurchaseRequestIngressReceiptMinAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptMinAggregateInputType>;
export const PurchaseRequestIngressReceiptMinAggregateInputObjectZodSchema = makeSchema();

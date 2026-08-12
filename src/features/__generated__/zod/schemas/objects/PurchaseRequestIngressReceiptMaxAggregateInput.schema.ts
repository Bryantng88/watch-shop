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
export const PurchaseRequestIngressReceiptMaxAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptMaxAggregateInputType>;
export const PurchaseRequestIngressReceiptMaxAggregateInputObjectZodSchema = makeSchema();

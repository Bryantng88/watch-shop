import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  addedItemCount: z.literal(true).optional()
}).strict();
export const PurchaseRequestIngressReceiptSumAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptSumAggregateInputType>;
export const PurchaseRequestIngressReceiptSumAggregateInputObjectZodSchema = makeSchema();

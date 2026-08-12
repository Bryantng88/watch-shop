import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  addedItemCount: z.literal(true).optional()
}).strict();
export const PurchaseRequestIngressReceiptAvgAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptAvgAggregateInputType>;
export const PurchaseRequestIngressReceiptAvgAggregateInputObjectZodSchema = makeSchema();

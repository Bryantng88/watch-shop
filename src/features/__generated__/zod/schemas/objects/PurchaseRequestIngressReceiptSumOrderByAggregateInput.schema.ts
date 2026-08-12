import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  addedItemCount: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestIngressReceiptSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptSumOrderByAggregateInput>;
export const PurchaseRequestIngressReceiptSumOrderByAggregateInputObjectZodSchema = makeSchema();

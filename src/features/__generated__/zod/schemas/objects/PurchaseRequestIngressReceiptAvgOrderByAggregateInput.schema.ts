import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  addedItemCount: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestIngressReceiptAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptAvgOrderByAggregateInput>;
export const PurchaseRequestIngressReceiptAvgOrderByAggregateInputObjectZodSchema = makeSchema();

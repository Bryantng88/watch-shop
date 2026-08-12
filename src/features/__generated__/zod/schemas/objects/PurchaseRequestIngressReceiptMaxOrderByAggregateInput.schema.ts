import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  requestKey: SortOrderSchema.optional(),
  requestHash: SortOrderSchema.optional(),
  purchaseRequestId: SortOrderSchema.optional(),
  disposition: SortOrderSchema.optional(),
  addedItemCount: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestIngressReceiptMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptMaxOrderByAggregateInput>;
export const PurchaseRequestIngressReceiptMaxOrderByAggregateInputObjectZodSchema = makeSchema();

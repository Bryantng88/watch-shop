import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { PurchaseRequestIngressReceiptCountOrderByAggregateInputObjectSchema as PurchaseRequestIngressReceiptCountOrderByAggregateInputObjectSchema } from './PurchaseRequestIngressReceiptCountOrderByAggregateInput.schema';
import { PurchaseRequestIngressReceiptAvgOrderByAggregateInputObjectSchema as PurchaseRequestIngressReceiptAvgOrderByAggregateInputObjectSchema } from './PurchaseRequestIngressReceiptAvgOrderByAggregateInput.schema';
import { PurchaseRequestIngressReceiptMaxOrderByAggregateInputObjectSchema as PurchaseRequestIngressReceiptMaxOrderByAggregateInputObjectSchema } from './PurchaseRequestIngressReceiptMaxOrderByAggregateInput.schema';
import { PurchaseRequestIngressReceiptMinOrderByAggregateInputObjectSchema as PurchaseRequestIngressReceiptMinOrderByAggregateInputObjectSchema } from './PurchaseRequestIngressReceiptMinOrderByAggregateInput.schema';
import { PurchaseRequestIngressReceiptSumOrderByAggregateInputObjectSchema as PurchaseRequestIngressReceiptSumOrderByAggregateInputObjectSchema } from './PurchaseRequestIngressReceiptSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  requestKey: SortOrderSchema.optional(),
  requestHash: SortOrderSchema.optional(),
  purchaseRequestId: SortOrderSchema.optional(),
  disposition: SortOrderSchema.optional(),
  addedItemCount: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => PurchaseRequestIngressReceiptCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => PurchaseRequestIngressReceiptAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => PurchaseRequestIngressReceiptMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => PurchaseRequestIngressReceiptMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => PurchaseRequestIngressReceiptSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const PurchaseRequestIngressReceiptOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptOrderByWithAggregationInput>;
export const PurchaseRequestIngressReceiptOrderByWithAggregationInputObjectZodSchema = makeSchema();

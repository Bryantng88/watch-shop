import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PurchaseRequestItemCountOrderByAggregateInputObjectSchema as PurchaseRequestItemCountOrderByAggregateInputObjectSchema } from './PurchaseRequestItemCountOrderByAggregateInput.schema';
import { PurchaseRequestItemAvgOrderByAggregateInputObjectSchema as PurchaseRequestItemAvgOrderByAggregateInputObjectSchema } from './PurchaseRequestItemAvgOrderByAggregateInput.schema';
import { PurchaseRequestItemMaxOrderByAggregateInputObjectSchema as PurchaseRequestItemMaxOrderByAggregateInputObjectSchema } from './PurchaseRequestItemMaxOrderByAggregateInput.schema';
import { PurchaseRequestItemMinOrderByAggregateInputObjectSchema as PurchaseRequestItemMinOrderByAggregateInputObjectSchema } from './PurchaseRequestItemMinOrderByAggregateInput.schema';
import { PurchaseRequestItemSumOrderByAggregateInputObjectSchema as PurchaseRequestItemSumOrderByAggregateInputObjectSchema } from './PurchaseRequestItemSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  purchaseRequestId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  titleSnapshot: SortOrderSchema.optional(),
  listPriceSnapshot: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  decision: SortOrderSchema.optional(),
  agreedPrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  decisionReason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => PurchaseRequestItemCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => PurchaseRequestItemAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => PurchaseRequestItemMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => PurchaseRequestItemMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => PurchaseRequestItemSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const PurchaseRequestItemOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemOrderByWithAggregationInput>;
export const PurchaseRequestItemOrderByWithAggregationInputObjectZodSchema = makeSchema();

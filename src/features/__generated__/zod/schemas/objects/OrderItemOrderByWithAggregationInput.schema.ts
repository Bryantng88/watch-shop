import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { OrderItemCountOrderByAggregateInputObjectSchema as OrderItemCountOrderByAggregateInputObjectSchema } from './OrderItemCountOrderByAggregateInput.schema';
import { OrderItemAvgOrderByAggregateInputObjectSchema as OrderItemAvgOrderByAggregateInputObjectSchema } from './OrderItemAvgOrderByAggregateInput.schema';
import { OrderItemMaxOrderByAggregateInputObjectSchema as OrderItemMaxOrderByAggregateInputObjectSchema } from './OrderItemMaxOrderByAggregateInput.schema';
import { OrderItemMinOrderByAggregateInputObjectSchema as OrderItemMinOrderByAggregateInputObjectSchema } from './OrderItemMinOrderByAggregateInput.schema';
import { OrderItemSumOrderByAggregateInputObjectSchema as OrderItemSumOrderByAggregateInputObjectSchema } from './OrderItemSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  price: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  subtotal: SortOrderSchema.optional(),
  img: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => OrderItemCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => OrderItemAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => OrderItemMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => OrderItemMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => OrderItemSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const OrderItemOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.OrderItemOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemOrderByWithAggregationInput>;
export const OrderItemOrderByWithAggregationInputObjectZodSchema = makeSchema();

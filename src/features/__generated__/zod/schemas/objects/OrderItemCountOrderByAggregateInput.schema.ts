import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  variantId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  listPriceAtOrder: SortOrderSchema.optional(),
  discountType: SortOrderSchema.optional(),
  discountValue: SortOrderSchema.optional(),
  unitPriceAgreed: SortOrderSchema.optional(),
  taxRate: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  subtotal: SortOrderSchema.optional(),
  img: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const OrderItemCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.OrderItemCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCountOrderByAggregateInput>;
export const OrderItemCountOrderByAggregateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  listPriceAtOrder: SortOrderSchema.optional(),
  discountValue: SortOrderSchema.optional(),
  unitPriceAgreed: SortOrderSchema.optional(),
  taxRate: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  subtotal: SortOrderSchema.optional()
}).strict();
export const OrderItemSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.OrderItemSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemSumOrderByAggregateInput>;
export const OrderItemSumOrderByAggregateInputObjectZodSchema = makeSchema();

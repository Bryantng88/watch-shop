import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  subtotal: SortOrderSchema.optional(),
  shippingFee: SortOrderSchema.optional(),
  depositqequired: SortOrderSchema.optional(),
  depositpaid: SortOrderSchema.optional()
}).strict();
export const OrderSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.OrderSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderSumOrderByAggregateInput>;
export const OrderSumOrderByAggregateInputObjectZodSchema = makeSchema();

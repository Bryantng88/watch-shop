import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderCode: SortOrderSchema.optional(),
  customerId: SortOrderSchema.optional(),
  shipName: SortOrderSchema.optional(),
  shipPhone: SortOrderSchema.optional(),
  shipEmail: SortOrderSchema.optional(),
  shipAddress: SortOrderSchema.optional(),
  shipWard: SortOrderSchema.optional(),
  shipCity: SortOrderSchema.optional(),
  subtotal: SortOrderSchema.optional(),
  shippingFee: SortOrderSchema.optional(),
  total: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  paymentStatus: SortOrderSchema.optional(),
  paymentMethod: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const OrderMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.OrderMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderMaxOrderByAggregateInput>;
export const OrderMaxOrderByAggregateInputObjectZodSchema = makeSchema();

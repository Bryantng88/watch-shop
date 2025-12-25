import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderCode: SortOrderSchema.optional(),
  customerId: SortOrderSchema.optional(),
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
  updatedAt: SortOrderSchema.optional(),
  customerName: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional()
}).strict();
export const OrderCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.OrderCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCountOrderByAggregateInput>;
export const OrderCountOrderByAggregateInputObjectZodSchema = makeSchema();

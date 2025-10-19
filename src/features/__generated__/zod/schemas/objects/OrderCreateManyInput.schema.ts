import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderCode: z.string(),
  customerId: z.string().optional().nullable(),
  shipName: z.string(),
  shipPhone: z.string(),
  shipEmail: z.string(),
  shipAddress: z.string(),
  shipWard: z.string().optional().nullable(),
  shipCity: z.string(),
  subtotal: z.number(),
  shippingFee: z.number().optional().nullable(),
  total: z.number(),
  status: OrderStatusSchema.optional(),
  paymentStatus: PaymentStatusSchema.optional(),
  paymentMethod: PaymentMethodSchema.optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const OrderCreateManyInputObjectSchema: z.ZodType<Prisma.OrderCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateManyInput>;
export const OrderCreateManyInputObjectZodSchema = makeSchema();

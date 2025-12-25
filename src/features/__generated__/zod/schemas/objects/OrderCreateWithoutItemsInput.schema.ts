import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { InvoiceCreateNestedManyWithoutOrderInputObjectSchema as InvoiceCreateNestedManyWithoutOrderInputObjectSchema } from './InvoiceCreateNestedManyWithoutOrderInput.schema';
import { CustomerCreateNestedOneWithoutOrdersInputObjectSchema as CustomerCreateNestedOneWithoutOrdersInputObjectSchema } from './CustomerCreateNestedOneWithoutOrdersInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderCode: z.string(),
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
  updatedAt: z.coerce.date().optional(),
  customerName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutOrdersInputObjectSchema).optional()
}).strict();
export const OrderCreateWithoutItemsInputObjectSchema: z.ZodType<Prisma.OrderCreateWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateWithoutItemsInput>;
export const OrderCreateWithoutItemsInputObjectZodSchema = makeSchema();

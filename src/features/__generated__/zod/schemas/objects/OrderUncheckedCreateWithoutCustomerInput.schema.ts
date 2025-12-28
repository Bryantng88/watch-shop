import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { InvoiceUncheckedCreateNestedManyWithoutOrderInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutOrderInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutOrderInput.schema';
import { OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  refNo: z.string(),
  shipPhone: z.string(),
  shipAddress: z.string(),
  shipWard: z.string().optional().nullable(),
  shipCity: z.string(),
  subtotal: z.number(),
  shippingFee: z.number().optional().nullable(),
  status: OrderStatusSchema.optional(),
  paymentStatus: PaymentStatusSchema.optional(),
  paymentMethod: PaymentMethodSchema.optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  customerName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  shipDistrict: z.string().optional().nullable(),
  Invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  items: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema).optional()
}).strict();
export const OrderUncheckedCreateWithoutCustomerInputObjectSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUncheckedCreateWithoutCustomerInput>;
export const OrderUncheckedCreateWithoutCustomerInputObjectZodSchema = makeSchema();

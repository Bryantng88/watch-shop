import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { InvoiceCreateNestedManyWithoutOrderInputObjectSchema as InvoiceCreateNestedManyWithoutOrderInputObjectSchema } from './InvoiceCreateNestedManyWithoutOrderInput.schema';
import { OrderItemCreateNestedManyWithoutOrderInputObjectSchema as OrderItemCreateNestedManyWithoutOrderInputObjectSchema } from './OrderItemCreateNestedManyWithoutOrderInput.schema';
import { ShipmentCreateNestedOneWithoutOrderInputObjectSchema as ShipmentCreateNestedOneWithoutOrderInputObjectSchema } from './ShipmentCreateNestedOneWithoutOrderInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  refNo: z.string().optional().nullable(),
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
  hasShipment: z.boolean().optional(),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  items: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  Shipment: z.lazy(() => ShipmentCreateNestedOneWithoutOrderInputObjectSchema).optional()
}).strict();
export const OrderCreateWithoutCustomerInputObjectSchema: z.ZodType<Prisma.OrderCreateWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateWithoutCustomerInput>;
export const OrderCreateWithoutCustomerInputObjectZodSchema = makeSchema();

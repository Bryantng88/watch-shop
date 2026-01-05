import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { reservetypeSchema } from '../enums/reservetype.schema';
import { CustomerCreateNestedOneWithoutOrdersInputObjectSchema as CustomerCreateNestedOneWithoutOrdersInputObjectSchema } from './CustomerCreateNestedOneWithoutOrdersInput.schema';
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
  reserveType: reservetypeSchema.optional().nullable(),
  reserveUntil: z.coerce.date().optional().nullable(),
  depositRequired: z.number().optional().nullable(),
  depositPaid: z.number().optional().nullable(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutOrdersInputObjectSchema).optional(),
  items: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  Shipment: z.lazy(() => ShipmentCreateNestedOneWithoutOrderInputObjectSchema).optional()
}).strict();
export const OrderCreateWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.OrderCreateWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateWithoutInvoiceInput>;
export const OrderCreateWithoutInvoiceInputObjectZodSchema = makeSchema();

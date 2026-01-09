import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { ReserveTypeSchema } from '../enums/ReserveType.schema';
import { OrderSourceSchema } from '../enums/OrderSource.schema';
import { OrderVerificationStatusSchema } from '../enums/OrderVerificationStatus.schema';
import { OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutOrderInput.schema';
import { ShipmentUncheckedCreateNestedOneWithoutOrderInputObjectSchema as ShipmentUncheckedCreateNestedOneWithoutOrderInputObjectSchema } from './ShipmentUncheckedCreateNestedOneWithoutOrderInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  refNo: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
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
  reserveType: ReserveTypeSchema.optional().nullable(),
  reserveUntil: z.coerce.date().optional().nullable(),
  depositRequired: z.number().optional().nullable(),
  depositPaid: z.number().optional().nullable(),
  source: OrderSourceSchema.optional(),
  verificationStatus: OrderVerificationStatusSchema.optional(),
  items: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  Shipment: z.lazy(() => ShipmentUncheckedCreateNestedOneWithoutOrderInputObjectSchema).optional()
}).strict();
export const OrderUncheckedCreateWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUncheckedCreateWithoutInvoiceInput>;
export const OrderUncheckedCreateWithoutInvoiceInputObjectZodSchema = makeSchema();

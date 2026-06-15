import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { ReserveTypeSchema } from '../enums/ReserveType.schema';
import { OrderSourceSchema } from '../enums/OrderSource.schema';
import { OrderVerificationStatusSchema } from '../enums/OrderVerificationStatus.schema';
import { OrderFlowTypeSchema } from '../enums/OrderFlowType.schema';
import { InvoiceUncheckedCreateNestedManyWithoutOrderInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutOrderInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutOrderInput.schema';
import { OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutOrderInput.schema';
import { ShipmentUncheckedCreateNestedManyWithoutOrderInputObjectSchema as ShipmentUncheckedCreateNestedManyWithoutOrderInputObjectSchema } from './ShipmentUncheckedCreateNestedManyWithoutOrderInput.schema';
import { WorkCaseUncheckedCreateNestedManyWithoutOrderInputObjectSchema as WorkCaseUncheckedCreateNestedManyWithoutOrderInputObjectSchema } from './WorkCaseUncheckedCreateNestedManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  refNo: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  shipPhone: z.string(),
  shipAddress: z.string(),
  shipWard: z.string().optional().nullable(),
  shipCity: z.string(),
  subtotal: z.number(),
  shippingAmount: z.number().optional().nullable(),
  status: OrderStatusSchema.optional(),
  paymentStatus: PaymentStatusSchema.optional(),
  paymentMethod: PaymentMethodSchema.optional().nullable(),
  depositPaymentMethod: PaymentMethodSchema.optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  customerName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  shipDistrict: z.string().optional().nullable(),
  hasShipment: z.boolean(),
  reserveType: ReserveTypeSchema.optional().nullable(),
  reserveUntil: z.coerce.date().optional().nullable(),
  depositRequired: z.number().optional().nullable(),
  depositPaid: z.number().optional().nullable(),
  source: OrderSourceSchema.optional(),
  verificationStatus: OrderVerificationStatusSchema.optional(),
  quick_from_product_id: z.string().optional().nullable(),
  quickFromProductId: z.string().optional().nullable(),
  quickFlowType: OrderFlowTypeSchema.optional(),
  Invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  orderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  shipments: z.lazy(() => ShipmentUncheckedCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  workCase: z.lazy(() => WorkCaseUncheckedCreateNestedManyWithoutOrderInputObjectSchema).optional()
}).strict();
export const OrderUncheckedCreateWithoutTaskInputObjectSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUncheckedCreateWithoutTaskInput>;
export const OrderUncheckedCreateWithoutTaskInputObjectZodSchema = makeSchema();

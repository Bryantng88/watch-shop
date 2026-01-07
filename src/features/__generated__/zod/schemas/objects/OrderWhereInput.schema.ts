import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { EnumOrderStatusFilterObjectSchema as EnumOrderStatusFilterObjectSchema } from './EnumOrderStatusFilter.schema';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { EnumPaymentStatusFilterObjectSchema as EnumPaymentStatusFilterObjectSchema } from './EnumPaymentStatusFilter.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { EnumPaymentMethodNullableFilterObjectSchema as EnumPaymentMethodNullableFilterObjectSchema } from './EnumPaymentMethodNullableFilter.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { EnumReserveTypeNullableFilterObjectSchema as EnumReserveTypeNullableFilterObjectSchema } from './EnumReserveTypeNullableFilter.schema';
import { ReserveTypeSchema } from '../enums/ReserveType.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { InvoiceListRelationFilterObjectSchema as InvoiceListRelationFilterObjectSchema } from './InvoiceListRelationFilter.schema';
import { CustomerNullableScalarRelationFilterObjectSchema as CustomerNullableScalarRelationFilterObjectSchema } from './CustomerNullableScalarRelationFilter.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { OrderItemListRelationFilterObjectSchema as OrderItemListRelationFilterObjectSchema } from './OrderItemListRelationFilter.schema';
import { ShipmentNullableScalarRelationFilterObjectSchema as ShipmentNullableScalarRelationFilterObjectSchema } from './ShipmentNullableScalarRelationFilter.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const orderwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderWhereInputObjectSchema), z.lazy(() => OrderWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderWhereInputObjectSchema), z.lazy(() => OrderWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  refNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  customerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipPhone: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipAddress: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipWard: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipCity: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  subtotal: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  shippingFee: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumOrderStatusFilterObjectSchema), OrderStatusSchema]).optional(),
  paymentStatus: z.union([z.lazy(() => EnumPaymentStatusFilterObjectSchema), PaymentStatusSchema]).optional(),
  paymentMethod: z.union([z.lazy(() => EnumPaymentMethodNullableFilterObjectSchema), PaymentMethodSchema]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  customerName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipDistrict: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  hasShipment: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  reserveType: z.union([z.lazy(() => EnumReserveTypeNullableFilterObjectSchema), ReserveTypeSchema]).optional().nullable(),
  reserveUntil: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  depositRequired: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  depositPaid: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  Invoice: z.lazy(() => InvoiceListRelationFilterObjectSchema).optional(),
  customer: z.union([z.lazy(() => CustomerNullableScalarRelationFilterObjectSchema), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  items: z.lazy(() => OrderItemListRelationFilterObjectSchema).optional(),
  Shipment: z.union([z.lazy(() => ShipmentNullableScalarRelationFilterObjectSchema), z.lazy(() => ShipmentWhereInputObjectSchema)]).optional()
}).strict();
export const OrderWhereInputObjectSchema: z.ZodType<Prisma.OrderWhereInput> = orderwhereinputSchema as unknown as z.ZodType<Prisma.OrderWhereInput>;
export const OrderWhereInputObjectZodSchema = orderwhereinputSchema;

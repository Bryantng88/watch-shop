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
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const orderscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderScalarWhereInputObjectSchema), z.lazy(() => OrderScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderScalarWhereInputObjectSchema), z.lazy(() => OrderScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  customerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipPhone: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipEmail: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipAddress: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipWard: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipCity: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  subtotal: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  shippingFee: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  total: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  status: z.union([z.lazy(() => EnumOrderStatusFilterObjectSchema), OrderStatusSchema]).optional(),
  paymentStatus: z.union([z.lazy(() => EnumPaymentStatusFilterObjectSchema), PaymentStatusSchema]).optional(),
  paymentMethod: z.union([z.lazy(() => EnumPaymentMethodNullableFilterObjectSchema), PaymentMethodSchema]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  customerName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const OrderScalarWhereInputObjectSchema: z.ZodType<Prisma.OrderScalarWhereInput> = orderscalarwhereinputSchema as unknown as z.ZodType<Prisma.OrderScalarWhereInput>;
export const OrderScalarWhereInputObjectZodSchema = orderscalarwhereinputSchema;

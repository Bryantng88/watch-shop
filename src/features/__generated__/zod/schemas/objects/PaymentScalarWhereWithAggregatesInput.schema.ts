import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumPaymentMethodWithAggregatesFilterObjectSchema as EnumPaymentMethodWithAggregatesFilterObjectSchema } from './EnumPaymentMethodWithAggregatesFilter.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { DecimalWithAggregatesFilterObjectSchema as DecimalWithAggregatesFilterObjectSchema } from './DecimalWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { EnumPaymentDirectionNullableWithAggregatesFilterObjectSchema as EnumPaymentDirectionNullableWithAggregatesFilterObjectSchema } from './EnumPaymentDirectionNullableWithAggregatesFilter.schema';
import { PaymentDirectionSchema } from '../enums/PaymentDirection.schema';
import { EnumPaymentStatusWithAggregatesFilterObjectSchema as EnumPaymentStatusWithAggregatesFilterObjectSchema } from './EnumPaymentStatusWithAggregatesFilter.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { EnumPaymentPurposeWithAggregatesFilterObjectSchema as EnumPaymentPurposeWithAggregatesFilterObjectSchema } from './EnumPaymentPurposeWithAggregatesFilter.schema';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema';
import { EnumPaymentTypeWithAggregatesFilterObjectSchema as EnumPaymentTypeWithAggregatesFilterObjectSchema } from './EnumPaymentTypeWithAggregatesFilter.schema';
import { PaymentTypeSchema } from '../enums/PaymentType.schema'

const paymentscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PaymentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PaymentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PaymentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PaymentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PaymentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  method: z.union([z.lazy(() => EnumPaymentMethodWithAggregatesFilterObjectSchema), PaymentMethodSchema]).optional(),
  amount: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  currency: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  paidAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  reference: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  direction: z.union([z.lazy(() => EnumPaymentDirectionNullableWithAggregatesFilterObjectSchema), PaymentDirectionSchema]).optional().nullable(),
  order_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  service_request_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  vendor_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  acquisition_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumPaymentStatusWithAggregatesFilterObjectSchema), PaymentStatusSchema]).optional(),
  purpose: z.union([z.lazy(() => EnumPaymentPurposeWithAggregatesFilterObjectSchema), PaymentPurposeSchema]).optional(),
  shipment_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumPaymentTypeWithAggregatesFilterObjectSchema), PaymentTypeSchema]).optional(),
  refNo: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string().max(30)]).optional().nullable()
}).strict();
export const PaymentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PaymentScalarWhereWithAggregatesInput> = paymentscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PaymentScalarWhereWithAggregatesInput>;
export const PaymentScalarWhereWithAggregatesInputObjectZodSchema = paymentscalarwherewithaggregatesinputSchema;

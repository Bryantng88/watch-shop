import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumPaymentMethodFilterObjectSchema as EnumPaymentMethodFilterObjectSchema } from './EnumPaymentMethodFilter.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumPaymentDirectionNullableFilterObjectSchema as EnumPaymentDirectionNullableFilterObjectSchema } from './EnumPaymentDirectionNullableFilter.schema';
import { PaymentDirectionSchema } from '../enums/PaymentDirection.schema';
import { EnumPaymentStatusFilterObjectSchema as EnumPaymentStatusFilterObjectSchema } from './EnumPaymentStatusFilter.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { EnumPaymentPurposeFilterObjectSchema as EnumPaymentPurposeFilterObjectSchema } from './EnumPaymentPurposeFilter.schema';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema';
import { EnumPaymentTypeFilterObjectSchema as EnumPaymentTypeFilterObjectSchema } from './EnumPaymentTypeFilter.schema';
import { PaymentTypeSchema } from '../enums/PaymentType.schema'

const paymentscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PaymentScalarWhereInputObjectSchema), z.lazy(() => PaymentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PaymentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PaymentScalarWhereInputObjectSchema), z.lazy(() => PaymentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  method: z.union([z.lazy(() => EnumPaymentMethodFilterObjectSchema), PaymentMethodSchema]).optional(),
  amount: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  currency: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  paidAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  reference: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  direction: z.union([z.lazy(() => EnumPaymentDirectionNullableFilterObjectSchema), PaymentDirectionSchema]).optional().nullable(),
  order_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  service_request_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendor_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  acquisition_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumPaymentStatusFilterObjectSchema), PaymentStatusSchema]).optional(),
  purpose: z.union([z.lazy(() => EnumPaymentPurposeFilterObjectSchema), PaymentPurposeSchema]).optional(),
  shipment_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumPaymentTypeFilterObjectSchema), PaymentTypeSchema]).optional(),
  refNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  technical_issue_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const PaymentScalarWhereInputObjectSchema: z.ZodType<Prisma.PaymentScalarWhereInput> = paymentscalarwhereinputSchema as unknown as z.ZodType<Prisma.PaymentScalarWhereInput>;
export const PaymentScalarWhereInputObjectZodSchema = paymentscalarwhereinputSchema;

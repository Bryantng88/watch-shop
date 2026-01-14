import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumPaymentMethodFilterObjectSchema as EnumPaymentMethodFilterObjectSchema } from './EnumPaymentMethodFilter.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumpaymentdirectionNullableFilterObjectSchema as EnumpaymentdirectionNullableFilterObjectSchema } from './EnumpaymentdirectionNullableFilter.schema';
import { paymentdirectionSchema } from '../enums/paymentdirection.schema';
import { EnumPaymentStatusFilterObjectSchema as EnumPaymentStatusFilterObjectSchema } from './EnumPaymentStatusFilter.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { EnumPaymentPurposeFilterObjectSchema as EnumPaymentPurposeFilterObjectSchema } from './EnumPaymentPurposeFilter.schema';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema';
import { EnumPaymentTypeFilterObjectSchema as EnumPaymentTypeFilterObjectSchema } from './EnumPaymentTypeFilter.schema';
import { PaymentTypeSchema } from '../enums/PaymentType.schema'

const paymentwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PaymentWhereInputObjectSchema), z.lazy(() => PaymentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PaymentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PaymentWhereInputObjectSchema), z.lazy(() => PaymentWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  method: z.union([z.lazy(() => EnumPaymentMethodFilterObjectSchema), PaymentMethodSchema]).optional(),
  amount: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  currency: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  paidAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  reference: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  direction: z.union([z.lazy(() => EnumpaymentdirectionNullableFilterObjectSchema), paymentdirectionSchema]).optional().nullable(),
  order_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  service_request_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendor_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  acquisition_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumPaymentStatusFilterObjectSchema), PaymentStatusSchema]).optional(),
  purpose: z.union([z.lazy(() => EnumPaymentPurposeFilterObjectSchema), PaymentPurposeSchema]).optional(),
  shipment_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumPaymentTypeFilterObjectSchema), PaymentTypeSchema]).optional()
}).strict();
export const PaymentWhereInputObjectSchema: z.ZodType<Prisma.PaymentWhereInput> = paymentwhereinputSchema as unknown as z.ZodType<Prisma.PaymentWhereInput>;
export const PaymentWhereInputObjectZodSchema = paymentwhereinputSchema;

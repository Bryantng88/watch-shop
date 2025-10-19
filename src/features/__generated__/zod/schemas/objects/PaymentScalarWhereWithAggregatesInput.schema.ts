import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumPaymentMethodWithAggregatesFilterObjectSchema as EnumPaymentMethodWithAggregatesFilterObjectSchema } from './EnumPaymentMethodWithAggregatesFilter.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { DecimalWithAggregatesFilterObjectSchema as DecimalWithAggregatesFilterObjectSchema } from './DecimalWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema'

const paymentscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PaymentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PaymentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PaymentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PaymentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PaymentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  invoiceId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  method: z.union([z.lazy(() => EnumPaymentMethodWithAggregatesFilterObjectSchema), PaymentMethodSchema]).optional(),
  amount: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  currency: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  paidAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  reference: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PaymentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PaymentScalarWhereWithAggregatesInput> = paymentscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PaymentScalarWhereWithAggregatesInput>;
export const PaymentScalarWhereWithAggregatesInputObjectZodSchema = paymentscalarwherewithaggregatesinputSchema;

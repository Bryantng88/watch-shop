import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPaymentPurposeFilterObjectSchema as NestedEnumPaymentPurposeFilterObjectSchema } from './NestedEnumPaymentPurposeFilter.schema'

const nestedenumpaymentpurposewithaggregatesfilterSchema = z.object({
  equals: PaymentPurposeSchema.optional(),
  in: PaymentPurposeSchema.array().optional(),
  notIn: PaymentPurposeSchema.array().optional(),
  not: z.union([PaymentPurposeSchema, z.lazy(() => NestedEnumPaymentPurposeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentPurposeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentPurposeFilterObjectSchema).optional()
}).strict();
export const NestedEnumPaymentPurposeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPaymentPurposeWithAggregatesFilter> = nestedenumpaymentpurposewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPaymentPurposeWithAggregatesFilter>;
export const NestedEnumPaymentPurposeWithAggregatesFilterObjectZodSchema = nestedenumpaymentpurposewithaggregatesfilterSchema;

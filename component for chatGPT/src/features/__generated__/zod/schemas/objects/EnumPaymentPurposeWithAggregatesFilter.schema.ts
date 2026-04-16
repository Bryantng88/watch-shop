import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema';
import { NestedEnumPaymentPurposeWithAggregatesFilterObjectSchema as NestedEnumPaymentPurposeWithAggregatesFilterObjectSchema } from './NestedEnumPaymentPurposeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPaymentPurposeFilterObjectSchema as NestedEnumPaymentPurposeFilterObjectSchema } from './NestedEnumPaymentPurposeFilter.schema'

const makeSchema = () => z.object({
  equals: PaymentPurposeSchema.optional(),
  in: PaymentPurposeSchema.array().optional(),
  notIn: PaymentPurposeSchema.array().optional(),
  not: z.union([PaymentPurposeSchema, z.lazy(() => NestedEnumPaymentPurposeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentPurposeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentPurposeFilterObjectSchema).optional()
}).strict();
export const EnumPaymentPurposeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPaymentPurposeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPaymentPurposeWithAggregatesFilter>;
export const EnumPaymentPurposeWithAggregatesFilterObjectZodSchema = makeSchema();

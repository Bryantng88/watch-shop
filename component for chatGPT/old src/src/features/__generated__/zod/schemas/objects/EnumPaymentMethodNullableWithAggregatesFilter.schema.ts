import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { NestedEnumPaymentMethodNullableWithAggregatesFilterObjectSchema as NestedEnumPaymentMethodNullableWithAggregatesFilterObjectSchema } from './NestedEnumPaymentMethodNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumPaymentMethodNullableFilterObjectSchema as NestedEnumPaymentMethodNullableFilterObjectSchema } from './NestedEnumPaymentMethodNullableFilter.schema'

const makeSchema = () => z.object({
  equals: PaymentMethodSchema.optional().nullable(),
  in: PaymentMethodSchema.array().optional().nullable(),
  notIn: PaymentMethodSchema.array().optional().nullable(),
  not: z.union([PaymentMethodSchema, z.lazy(() => NestedEnumPaymentMethodNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentMethodNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentMethodNullableFilterObjectSchema).optional()
}).strict();
export const EnumPaymentMethodNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPaymentMethodNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPaymentMethodNullableWithAggregatesFilter>;
export const EnumPaymentMethodNullableWithAggregatesFilterObjectZodSchema = makeSchema();

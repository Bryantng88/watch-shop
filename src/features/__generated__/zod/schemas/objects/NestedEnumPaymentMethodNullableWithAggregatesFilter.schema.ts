import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumPaymentMethodNullableFilterObjectSchema as NestedEnumPaymentMethodNullableFilterObjectSchema } from './NestedEnumPaymentMethodNullableFilter.schema'

const nestedenumpaymentmethodnullablewithaggregatesfilterSchema = z.object({
  equals: PaymentMethodSchema.optional().nullable(),
  in: PaymentMethodSchema.array().optional().nullable(),
  notIn: PaymentMethodSchema.array().optional().nullable(),
  not: z.union([PaymentMethodSchema, z.lazy(() => NestedEnumPaymentMethodNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentMethodNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentMethodNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumPaymentMethodNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPaymentMethodNullableWithAggregatesFilter> = nestedenumpaymentmethodnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPaymentMethodNullableWithAggregatesFilter>;
export const NestedEnumPaymentMethodNullableWithAggregatesFilterObjectZodSchema = nestedenumpaymentmethodnullablewithaggregatesfilterSchema;

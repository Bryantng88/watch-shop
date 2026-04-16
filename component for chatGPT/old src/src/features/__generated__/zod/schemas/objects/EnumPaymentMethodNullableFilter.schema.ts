import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { NestedEnumPaymentMethodNullableFilterObjectSchema as NestedEnumPaymentMethodNullableFilterObjectSchema } from './NestedEnumPaymentMethodNullableFilter.schema'

const makeSchema = () => z.object({
  equals: PaymentMethodSchema.optional().nullable(),
  in: PaymentMethodSchema.array().optional().nullable(),
  notIn: PaymentMethodSchema.array().optional().nullable(),
  not: z.union([PaymentMethodSchema, z.lazy(() => NestedEnumPaymentMethodNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumPaymentMethodNullableFilterObjectSchema: z.ZodType<Prisma.EnumPaymentMethodNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPaymentMethodNullableFilter>;
export const EnumPaymentMethodNullableFilterObjectZodSchema = makeSchema();

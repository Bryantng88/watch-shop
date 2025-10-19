import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema'

const nestedenumpaymentmethodnullablefilterSchema = z.object({
  equals: PaymentMethodSchema.optional().nullable(),
  in: PaymentMethodSchema.array().optional().nullable(),
  notIn: PaymentMethodSchema.array().optional().nullable(),
  not: z.union([PaymentMethodSchema, z.lazy(() => NestedEnumPaymentMethodNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumPaymentMethodNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumPaymentMethodNullableFilter> = nestedenumpaymentmethodnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumPaymentMethodNullableFilter>;
export const NestedEnumPaymentMethodNullableFilterObjectZodSchema = nestedenumpaymentmethodnullablefilterSchema;

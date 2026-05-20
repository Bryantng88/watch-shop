import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema'

const nestedenumshippingfeepayernullablefilterSchema = z.object({
  equals: ShippingFeePayerSchema.optional().nullable(),
  in: ShippingFeePayerSchema.array().optional().nullable(),
  notIn: ShippingFeePayerSchema.array().optional().nullable(),
  not: z.union([ShippingFeePayerSchema, z.lazy(() => NestedEnumShippingFeePayerNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumShippingFeePayerNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumShippingFeePayerNullableFilter> = nestedenumshippingfeepayernullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumShippingFeePayerNullableFilter>;
export const NestedEnumShippingFeePayerNullableFilterObjectZodSchema = nestedenumshippingfeepayernullablefilterSchema;

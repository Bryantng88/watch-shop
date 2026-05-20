import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema';
import { NestedEnumShippingFeePayerNullableFilterObjectSchema as NestedEnumShippingFeePayerNullableFilterObjectSchema } from './NestedEnumShippingFeePayerNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ShippingFeePayerSchema.optional().nullable(),
  in: ShippingFeePayerSchema.array().optional().nullable(),
  notIn: ShippingFeePayerSchema.array().optional().nullable(),
  not: z.union([ShippingFeePayerSchema, z.lazy(() => NestedEnumShippingFeePayerNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumShippingFeePayerNullableFilterObjectSchema: z.ZodType<Prisma.EnumShippingFeePayerNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumShippingFeePayerNullableFilter>;
export const EnumShippingFeePayerNullableFilterObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema';
import { NestedEnumShippingFeePayerNullableWithAggregatesFilterObjectSchema as NestedEnumShippingFeePayerNullableWithAggregatesFilterObjectSchema } from './NestedEnumShippingFeePayerNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumShippingFeePayerNullableFilterObjectSchema as NestedEnumShippingFeePayerNullableFilterObjectSchema } from './NestedEnumShippingFeePayerNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ShippingFeePayerSchema.optional().nullable(),
  in: ShippingFeePayerSchema.array().optional().nullable(),
  notIn: ShippingFeePayerSchema.array().optional().nullable(),
  not: z.union([ShippingFeePayerSchema, z.lazy(() => NestedEnumShippingFeePayerNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumShippingFeePayerNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumShippingFeePayerNullableFilterObjectSchema).optional()
}).strict();
export const EnumShippingFeePayerNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumShippingFeePayerNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumShippingFeePayerNullableWithAggregatesFilter>;
export const EnumShippingFeePayerNullableWithAggregatesFilterObjectZodSchema = makeSchema();

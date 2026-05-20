import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumShippingFeePayerNullableFilterObjectSchema as NestedEnumShippingFeePayerNullableFilterObjectSchema } from './NestedEnumShippingFeePayerNullableFilter.schema'

const nestedenumshippingfeepayernullablewithaggregatesfilterSchema = z.object({
  equals: ShippingFeePayerSchema.optional().nullable(),
  in: ShippingFeePayerSchema.array().optional().nullable(),
  notIn: ShippingFeePayerSchema.array().optional().nullable(),
  not: z.union([ShippingFeePayerSchema, z.lazy(() => NestedEnumShippingFeePayerNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumShippingFeePayerNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumShippingFeePayerNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumShippingFeePayerNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumShippingFeePayerNullableWithAggregatesFilter> = nestedenumshippingfeepayernullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumShippingFeePayerNullableWithAggregatesFilter>;
export const NestedEnumShippingFeePayerNullableWithAggregatesFilterObjectZodSchema = nestedenumshippingfeepayernullablewithaggregatesfilterSchema;

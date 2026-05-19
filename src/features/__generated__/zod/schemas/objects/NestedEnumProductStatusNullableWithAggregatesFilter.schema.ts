import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumProductStatusNullableFilterObjectSchema as NestedEnumProductStatusNullableFilterObjectSchema } from './NestedEnumProductStatusNullableFilter.schema'

const nestedenumproductstatusnullablewithaggregatesfilterSchema = z.object({
  equals: ProductStatusSchema.optional().nullable(),
  in: ProductStatusSchema.array().optional().nullable(),
  notIn: ProductStatusSchema.array().optional().nullable(),
  not: z.union([ProductStatusSchema, z.lazy(() => NestedEnumProductStatusNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumProductStatusNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumProductStatusNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumProductStatusNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumProductStatusNullableWithAggregatesFilter> = nestedenumproductstatusnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumProductStatusNullableWithAggregatesFilter>;
export const NestedEnumProductStatusNullableWithAggregatesFilterObjectZodSchema = nestedenumproductstatusnullablewithaggregatesfilterSchema;

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumProductTypeNullableFilterObjectSchema as NestedEnumProductTypeNullableFilterObjectSchema } from './NestedEnumProductTypeNullableFilter.schema'

const nestedenumproducttypenullablewithaggregatesfilterSchema = z.object({
  equals: ProductTypeSchema.optional().nullable(),
  in: ProductTypeSchema.array().optional().nullable(),
  notIn: ProductTypeSchema.array().optional().nullable(),
  not: z.union([ProductTypeSchema, z.lazy(() => NestedEnumProductTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumProductTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumProductTypeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumProductTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumProductTypeNullableWithAggregatesFilter> = nestedenumproducttypenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumProductTypeNullableWithAggregatesFilter>;
export const NestedEnumProductTypeNullableWithAggregatesFilterObjectZodSchema = nestedenumproducttypenullablewithaggregatesfilterSchema;

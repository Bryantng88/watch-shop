import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { NestedEnumProductTypeNullableWithAggregatesFilterObjectSchema as NestedEnumProductTypeNullableWithAggregatesFilterObjectSchema } from './NestedEnumProductTypeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumProductTypeNullableFilterObjectSchema as NestedEnumProductTypeNullableFilterObjectSchema } from './NestedEnumProductTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ProductTypeSchema.optional().nullable(),
  in: ProductTypeSchema.array().optional().nullable(),
  notIn: ProductTypeSchema.array().optional().nullable(),
  not: z.union([ProductTypeSchema, z.lazy(() => NestedEnumProductTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumProductTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumProductTypeNullableFilterObjectSchema).optional()
}).strict();
export const EnumProductTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumProductTypeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumProductTypeNullableWithAggregatesFilter>;
export const EnumProductTypeNullableWithAggregatesFilterObjectZodSchema = makeSchema();

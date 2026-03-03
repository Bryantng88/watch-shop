import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { NestedEnumDiscountTypeNullableWithAggregatesFilterObjectSchema as NestedEnumDiscountTypeNullableWithAggregatesFilterObjectSchema } from './NestedEnumDiscountTypeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumDiscountTypeNullableFilterObjectSchema as NestedEnumDiscountTypeNullableFilterObjectSchema } from './NestedEnumDiscountTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: DiscountTypeSchema.optional().nullable(),
  in: DiscountTypeSchema.array().optional().nullable(),
  notIn: DiscountTypeSchema.array().optional().nullable(),
  not: z.union([DiscountTypeSchema, z.lazy(() => NestedEnumDiscountTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumDiscountTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumDiscountTypeNullableFilterObjectSchema).optional()
}).strict();
export const EnumDiscountTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumDiscountTypeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumDiscountTypeNullableWithAggregatesFilter>;
export const EnumDiscountTypeNullableWithAggregatesFilterObjectZodSchema = makeSchema();

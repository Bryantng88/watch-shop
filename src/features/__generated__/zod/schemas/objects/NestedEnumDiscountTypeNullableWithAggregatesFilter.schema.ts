import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumDiscountTypeNullableFilterObjectSchema as NestedEnumDiscountTypeNullableFilterObjectSchema } from './NestedEnumDiscountTypeNullableFilter.schema'

const nestedenumdiscounttypenullablewithaggregatesfilterSchema = z.object({
  equals: DiscountTypeSchema.optional().nullable(),
  in: DiscountTypeSchema.array().optional().nullable(),
  notIn: DiscountTypeSchema.array().optional().nullable(),
  not: z.union([DiscountTypeSchema, z.lazy(() => NestedEnumDiscountTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumDiscountTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumDiscountTypeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumDiscountTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumDiscountTypeNullableWithAggregatesFilter> = nestedenumdiscounttypenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumDiscountTypeNullableWithAggregatesFilter>;
export const NestedEnumDiscountTypeNullableWithAggregatesFilterObjectZodSchema = nestedenumdiscounttypenullablewithaggregatesfilterSchema;

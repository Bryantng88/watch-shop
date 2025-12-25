import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumdiscount_typeNullableFilterObjectSchema as NestedEnumdiscount_typeNullableFilterObjectSchema } from './NestedEnumdiscount_typeNullableFilter.schema'

const nestedenumdiscount_typenullablewithaggregatesfilterSchema = z.object({
  equals: discount_typeSchema.optional().nullable(),
  in: discount_typeSchema.array().optional().nullable(),
  notIn: discount_typeSchema.array().optional().nullable(),
  not: z.union([discount_typeSchema, z.lazy(() => NestedEnumdiscount_typeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumdiscount_typeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumdiscount_typeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumdiscount_typeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumdiscount_typeNullableWithAggregatesFilter> = nestedenumdiscount_typenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumdiscount_typeNullableWithAggregatesFilter>;
export const NestedEnumdiscount_typeNullableWithAggregatesFilterObjectZodSchema = nestedenumdiscount_typenullablewithaggregatesfilterSchema;

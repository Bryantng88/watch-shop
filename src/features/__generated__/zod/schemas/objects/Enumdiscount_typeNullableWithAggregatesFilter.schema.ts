import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { NestedEnumdiscount_typeNullableWithAggregatesFilterObjectSchema as NestedEnumdiscount_typeNullableWithAggregatesFilterObjectSchema } from './NestedEnumdiscount_typeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumdiscount_typeNullableFilterObjectSchema as NestedEnumdiscount_typeNullableFilterObjectSchema } from './NestedEnumdiscount_typeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: discount_typeSchema.optional().nullable(),
  in: discount_typeSchema.array().optional().nullable(),
  notIn: discount_typeSchema.array().optional().nullable(),
  not: z.union([discount_typeSchema, z.lazy(() => NestedEnumdiscount_typeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumdiscount_typeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumdiscount_typeNullableFilterObjectSchema).optional()
}).strict();
export const Enumdiscount_typeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.Enumdiscount_typeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.Enumdiscount_typeNullableWithAggregatesFilter>;
export const Enumdiscount_typeNullableWithAggregatesFilterObjectZodSchema = makeSchema();

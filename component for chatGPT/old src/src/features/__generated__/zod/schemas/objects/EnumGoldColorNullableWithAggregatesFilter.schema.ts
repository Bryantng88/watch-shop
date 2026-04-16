import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GoldColorSchema } from '../enums/GoldColor.schema';
import { NestedEnumGoldColorNullableWithAggregatesFilterObjectSchema as NestedEnumGoldColorNullableWithAggregatesFilterObjectSchema } from './NestedEnumGoldColorNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumGoldColorNullableFilterObjectSchema as NestedEnumGoldColorNullableFilterObjectSchema } from './NestedEnumGoldColorNullableFilter.schema'

const makeSchema = () => z.object({
  equals: GoldColorSchema.optional().nullable(),
  in: GoldColorSchema.array().optional().nullable(),
  notIn: GoldColorSchema.array().optional().nullable(),
  not: z.union([GoldColorSchema, z.lazy(() => NestedEnumGoldColorNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumGoldColorNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumGoldColorNullableFilterObjectSchema).optional()
}).strict();
export const EnumGoldColorNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumGoldColorNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumGoldColorNullableWithAggregatesFilter>;
export const EnumGoldColorNullableWithAggregatesFilterObjectZodSchema = makeSchema();

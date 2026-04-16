import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GoldColorSchema } from '../enums/GoldColor.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumGoldColorNullableFilterObjectSchema as NestedEnumGoldColorNullableFilterObjectSchema } from './NestedEnumGoldColorNullableFilter.schema'

const nestedenumgoldcolornullablewithaggregatesfilterSchema = z.object({
  equals: GoldColorSchema.optional().nullable(),
  in: GoldColorSchema.array().optional().nullable(),
  notIn: GoldColorSchema.array().optional().nullable(),
  not: z.union([GoldColorSchema, z.lazy(() => NestedEnumGoldColorNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumGoldColorNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumGoldColorNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumGoldColorNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumGoldColorNullableWithAggregatesFilter> = nestedenumgoldcolornullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumGoldColorNullableWithAggregatesFilter>;
export const NestedEnumGoldColorNullableWithAggregatesFilterObjectZodSchema = nestedenumgoldcolornullablewithaggregatesfilterSchema;

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { reservetypeSchema } from '../enums/reservetype.schema';
import { NestedEnumreservetypeNullableWithAggregatesFilterObjectSchema as NestedEnumreservetypeNullableWithAggregatesFilterObjectSchema } from './NestedEnumreservetypeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumreservetypeNullableFilterObjectSchema as NestedEnumreservetypeNullableFilterObjectSchema } from './NestedEnumreservetypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: reservetypeSchema.optional().nullable(),
  in: reservetypeSchema.array().optional().nullable(),
  notIn: reservetypeSchema.array().optional().nullable(),
  not: z.union([reservetypeSchema, z.lazy(() => NestedEnumreservetypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumreservetypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumreservetypeNullableFilterObjectSchema).optional()
}).strict();
export const EnumreservetypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumreservetypeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumreservetypeNullableWithAggregatesFilter>;
export const EnumreservetypeNullableWithAggregatesFilterObjectZodSchema = makeSchema();

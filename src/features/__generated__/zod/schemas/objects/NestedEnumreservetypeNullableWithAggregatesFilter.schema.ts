import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { reservetypeSchema } from '../enums/reservetype.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumreservetypeNullableFilterObjectSchema as NestedEnumreservetypeNullableFilterObjectSchema } from './NestedEnumreservetypeNullableFilter.schema'

const nestedenumreservetypenullablewithaggregatesfilterSchema = z.object({
  equals: reservetypeSchema.optional().nullable(),
  in: reservetypeSchema.array().optional().nullable(),
  notIn: reservetypeSchema.array().optional().nullable(),
  not: z.union([reservetypeSchema, z.lazy(() => NestedEnumreservetypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumreservetypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumreservetypeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumreservetypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumreservetypeNullableWithAggregatesFilter> = nestedenumreservetypenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumreservetypeNullableWithAggregatesFilter>;
export const NestedEnumreservetypeNullableWithAggregatesFilterObjectZodSchema = nestedenumreservetypenullablewithaggregatesfilterSchema;

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GlassSchema } from '../enums/Glass.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumGlassNullableFilterObjectSchema as NestedEnumGlassNullableFilterObjectSchema } from './NestedEnumGlassNullableFilter.schema'

const nestedenumglassnullablewithaggregatesfilterSchema = z.object({
  equals: GlassSchema.optional().nullable(),
  in: GlassSchema.array().optional().nullable(),
  notIn: GlassSchema.array().optional().nullable(),
  not: z.union([GlassSchema, z.lazy(() => NestedEnumGlassNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumGlassNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumGlassNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumGlassNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumGlassNullableWithAggregatesFilter> = nestedenumglassnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumGlassNullableWithAggregatesFilter>;
export const NestedEnumGlassNullableWithAggregatesFilterObjectZodSchema = nestedenumglassnullablewithaggregatesfilterSchema;

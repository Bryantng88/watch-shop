import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GlassSchema } from '../enums/Glass.schema';
import { NestedEnumGlassNullableFilterObjectSchema as NestedEnumGlassNullableFilterObjectSchema } from './NestedEnumGlassNullableFilter.schema'

const makeSchema = () => z.object({
  equals: GlassSchema.optional().nullable(),
  in: GlassSchema.array().optional().nullable(),
  notIn: GlassSchema.array().optional().nullable(),
  not: z.union([GlassSchema, z.lazy(() => NestedEnumGlassNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumGlassNullableFilterObjectSchema: z.ZodType<Prisma.EnumGlassNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumGlassNullableFilter>;
export const EnumGlassNullableFilterObjectZodSchema = makeSchema();

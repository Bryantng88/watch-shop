import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GlassSchema } from '../enums/Glass.schema'

const nestedenumglassnullablefilterSchema = z.object({
  equals: GlassSchema.optional().nullable(),
  in: GlassSchema.array().optional().nullable(),
  notIn: GlassSchema.array().optional().nullable(),
  not: z.union([GlassSchema, z.lazy(() => NestedEnumGlassNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumGlassNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumGlassNullableFilter> = nestedenumglassnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumGlassNullableFilter>;
export const NestedEnumGlassNullableFilterObjectZodSchema = nestedenumglassnullablefilterSchema;

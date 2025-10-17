import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GlassSchema } from '../enums/Glass.schema';
import { NestedEnumGlassFilterObjectSchema as NestedEnumGlassFilterObjectSchema } from './NestedEnumGlassFilter.schema'

const makeSchema = () => z.object({
  equals: GlassSchema.optional(),
  in: GlassSchema.array().optional(),
  notIn: GlassSchema.array().optional(),
  not: z.union([GlassSchema, z.lazy(() => NestedEnumGlassFilterObjectSchema)]).optional()
}).strict();
export const EnumGlassFilterObjectSchema: z.ZodType<Prisma.EnumGlassFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumGlassFilter>;
export const EnumGlassFilterObjectZodSchema = makeSchema();

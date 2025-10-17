import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GlassSchema } from '../enums/Glass.schema'

const nestedenumglassfilterSchema = z.object({
  equals: GlassSchema.optional(),
  in: GlassSchema.array().optional(),
  notIn: GlassSchema.array().optional(),
  not: z.union([GlassSchema, z.lazy(() => NestedEnumGlassFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumGlassFilterObjectSchema: z.ZodType<Prisma.NestedEnumGlassFilter> = nestedenumglassfilterSchema as unknown as z.ZodType<Prisma.NestedEnumGlassFilter>;
export const NestedEnumGlassFilterObjectZodSchema = nestedenumglassfilterSchema;

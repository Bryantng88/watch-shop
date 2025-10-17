import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GlassSchema } from '../enums/Glass.schema';
import { NestedEnumGlassWithAggregatesFilterObjectSchema as NestedEnumGlassWithAggregatesFilterObjectSchema } from './NestedEnumGlassWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumGlassFilterObjectSchema as NestedEnumGlassFilterObjectSchema } from './NestedEnumGlassFilter.schema'

const makeSchema = () => z.object({
  equals: GlassSchema.optional(),
  in: GlassSchema.array().optional(),
  notIn: GlassSchema.array().optional(),
  not: z.union([GlassSchema, z.lazy(() => NestedEnumGlassWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumGlassFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumGlassFilterObjectSchema).optional()
}).strict();
export const EnumGlassWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumGlassWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumGlassWithAggregatesFilter>;
export const EnumGlassWithAggregatesFilterObjectZodSchema = makeSchema();

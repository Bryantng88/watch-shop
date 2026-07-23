import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingLifecycleSchema } from '../enums/MediaBindingLifecycle.schema';
import { NestedEnumMediaBindingLifecycleWithAggregatesFilterObjectSchema as NestedEnumMediaBindingLifecycleWithAggregatesFilterObjectSchema } from './NestedEnumMediaBindingLifecycleWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaBindingLifecycleFilterObjectSchema as NestedEnumMediaBindingLifecycleFilterObjectSchema } from './NestedEnumMediaBindingLifecycleFilter.schema'

const makeSchema = () => z.object({
  equals: MediaBindingLifecycleSchema.optional(),
  in: MediaBindingLifecycleSchema.array().optional(),
  notIn: MediaBindingLifecycleSchema.array().optional(),
  not: z.union([MediaBindingLifecycleSchema, z.lazy(() => NestedEnumMediaBindingLifecycleWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaBindingLifecycleFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaBindingLifecycleFilterObjectSchema).optional()
}).strict();
export const EnumMediaBindingLifecycleWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMediaBindingLifecycleWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaBindingLifecycleWithAggregatesFilter>;
export const EnumMediaBindingLifecycleWithAggregatesFilterObjectZodSchema = makeSchema();

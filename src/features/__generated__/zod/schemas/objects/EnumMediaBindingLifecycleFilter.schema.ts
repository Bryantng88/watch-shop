import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingLifecycleSchema } from '../enums/MediaBindingLifecycle.schema';
import { NestedEnumMediaBindingLifecycleFilterObjectSchema as NestedEnumMediaBindingLifecycleFilterObjectSchema } from './NestedEnumMediaBindingLifecycleFilter.schema'

const makeSchema = () => z.object({
  equals: MediaBindingLifecycleSchema.optional(),
  in: MediaBindingLifecycleSchema.array().optional(),
  notIn: MediaBindingLifecycleSchema.array().optional(),
  not: z.union([MediaBindingLifecycleSchema, z.lazy(() => NestedEnumMediaBindingLifecycleFilterObjectSchema)]).optional()
}).strict();
export const EnumMediaBindingLifecycleFilterObjectSchema: z.ZodType<Prisma.EnumMediaBindingLifecycleFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaBindingLifecycleFilter>;
export const EnumMediaBindingLifecycleFilterObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingLifecycleSchema } from '../enums/MediaBindingLifecycle.schema'

const nestedenummediabindinglifecyclefilterSchema = z.object({
  equals: MediaBindingLifecycleSchema.optional(),
  in: MediaBindingLifecycleSchema.array().optional(),
  notIn: MediaBindingLifecycleSchema.array().optional(),
  not: z.union([MediaBindingLifecycleSchema, z.lazy(() => NestedEnumMediaBindingLifecycleFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMediaBindingLifecycleFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaBindingLifecycleFilter> = nestedenummediabindinglifecyclefilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaBindingLifecycleFilter>;
export const NestedEnumMediaBindingLifecycleFilterObjectZodSchema = nestedenummediabindinglifecyclefilterSchema;

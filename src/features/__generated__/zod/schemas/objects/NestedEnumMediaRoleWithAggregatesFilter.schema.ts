import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaRoleSchema } from '../enums/MediaRole.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaRoleFilterObjectSchema as NestedEnumMediaRoleFilterObjectSchema } from './NestedEnumMediaRoleFilter.schema'

const nestedenummediarolewithaggregatesfilterSchema = z.object({
  equals: MediaRoleSchema.optional(),
  in: MediaRoleSchema.array().optional(),
  notIn: MediaRoleSchema.array().optional(),
  not: z.union([MediaRoleSchema, z.lazy(() => NestedEnumMediaRoleWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaRoleFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaRoleFilterObjectSchema).optional()
}).strict();
export const NestedEnumMediaRoleWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaRoleWithAggregatesFilter> = nestedenummediarolewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaRoleWithAggregatesFilter>;
export const NestedEnumMediaRoleWithAggregatesFilterObjectZodSchema = nestedenummediarolewithaggregatesfilterSchema;

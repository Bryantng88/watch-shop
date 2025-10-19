import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumImageRoleFilterObjectSchema as NestedEnumImageRoleFilterObjectSchema } from './NestedEnumImageRoleFilter.schema'

const nestedenumimagerolewithaggregatesfilterSchema = z.object({
  equals: ImageRoleSchema.optional(),
  in: ImageRoleSchema.array().optional(),
  notIn: ImageRoleSchema.array().optional(),
  not: z.union([ImageRoleSchema, z.lazy(() => NestedEnumImageRoleWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumImageRoleFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumImageRoleFilterObjectSchema).optional()
}).strict();
export const NestedEnumImageRoleWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumImageRoleWithAggregatesFilter> = nestedenumimagerolewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumImageRoleWithAggregatesFilter>;
export const NestedEnumImageRoleWithAggregatesFilterObjectZodSchema = nestedenumimagerolewithaggregatesfilterSchema;

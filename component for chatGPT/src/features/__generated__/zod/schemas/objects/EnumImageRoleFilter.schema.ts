import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema';
import { NestedEnumImageRoleFilterObjectSchema as NestedEnumImageRoleFilterObjectSchema } from './NestedEnumImageRoleFilter.schema'

const makeSchema = () => z.object({
  equals: ImageRoleSchema.optional(),
  in: ImageRoleSchema.array().optional(),
  notIn: ImageRoleSchema.array().optional(),
  not: z.union([ImageRoleSchema, z.lazy(() => NestedEnumImageRoleFilterObjectSchema)]).optional()
}).strict();
export const EnumImageRoleFilterObjectSchema: z.ZodType<Prisma.EnumImageRoleFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumImageRoleFilter>;
export const EnumImageRoleFilterObjectZodSchema = makeSchema();

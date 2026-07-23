import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaRoleSchema } from '../enums/MediaRole.schema';
import { NestedEnumMediaRoleFilterObjectSchema as NestedEnumMediaRoleFilterObjectSchema } from './NestedEnumMediaRoleFilter.schema'

const makeSchema = () => z.object({
  equals: MediaRoleSchema.optional(),
  in: MediaRoleSchema.array().optional(),
  notIn: MediaRoleSchema.array().optional(),
  not: z.union([MediaRoleSchema, z.lazy(() => NestedEnumMediaRoleFilterObjectSchema)]).optional()
}).strict();
export const EnumMediaRoleFilterObjectSchema: z.ZodType<Prisma.EnumMediaRoleFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaRoleFilter>;
export const EnumMediaRoleFilterObjectZodSchema = makeSchema();

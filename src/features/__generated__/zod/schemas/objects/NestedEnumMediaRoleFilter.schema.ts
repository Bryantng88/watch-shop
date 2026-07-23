import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaRoleSchema } from '../enums/MediaRole.schema'

const nestedenummediarolefilterSchema = z.object({
  equals: MediaRoleSchema.optional(),
  in: MediaRoleSchema.array().optional(),
  notIn: MediaRoleSchema.array().optional(),
  not: z.union([MediaRoleSchema, z.lazy(() => NestedEnumMediaRoleFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMediaRoleFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaRoleFilter> = nestedenummediarolefilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaRoleFilter>;
export const NestedEnumMediaRoleFilterObjectZodSchema = nestedenummediarolefilterSchema;

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema'

const nestedenumimagerolefilterSchema = z.object({
  equals: ImageRoleSchema.optional(),
  in: ImageRoleSchema.array().optional(),
  notIn: ImageRoleSchema.array().optional(),
  not: z.union([ImageRoleSchema, z.lazy(() => NestedEnumImageRoleFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumImageRoleFilterObjectSchema: z.ZodType<Prisma.NestedEnumImageRoleFilter> = nestedenumimagerolefilterSchema as unknown as z.ZodType<Prisma.NestedEnumImageRoleFilter>;
export const NestedEnumImageRoleFilterObjectZodSchema = nestedenumimagerolefilterSchema;

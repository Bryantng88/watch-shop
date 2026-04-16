import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema'

const nestedenumimagerolenullablefilterSchema = z.object({
  equals: ImageRoleSchema.optional().nullable(),
  in: ImageRoleSchema.array().optional().nullable(),
  notIn: ImageRoleSchema.array().optional().nullable(),
  not: z.union([ImageRoleSchema, z.lazy(() => NestedEnumImageRoleNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumImageRoleNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumImageRoleNullableFilter> = nestedenumimagerolenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumImageRoleNullableFilter>;
export const NestedEnumImageRoleNullableFilterObjectZodSchema = nestedenumimagerolenullablefilterSchema;

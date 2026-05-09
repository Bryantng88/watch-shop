import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema';
import { NestedEnumImageRoleNullableFilterObjectSchema as NestedEnumImageRoleNullableFilterObjectSchema } from './NestedEnumImageRoleNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ImageRoleSchema.optional().nullable(),
  in: ImageRoleSchema.array().optional().nullable(),
  notIn: ImageRoleSchema.array().optional().nullable(),
  not: z.union([ImageRoleSchema, z.lazy(() => NestedEnumImageRoleNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumImageRoleNullableFilterObjectSchema: z.ZodType<Prisma.EnumImageRoleNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumImageRoleNullableFilter>;
export const EnumImageRoleNullableFilterObjectZodSchema = makeSchema();

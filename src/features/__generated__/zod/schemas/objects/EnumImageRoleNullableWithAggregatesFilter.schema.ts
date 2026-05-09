import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema';
import { NestedEnumImageRoleNullableWithAggregatesFilterObjectSchema as NestedEnumImageRoleNullableWithAggregatesFilterObjectSchema } from './NestedEnumImageRoleNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumImageRoleNullableFilterObjectSchema as NestedEnumImageRoleNullableFilterObjectSchema } from './NestedEnumImageRoleNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ImageRoleSchema.optional().nullable(),
  in: ImageRoleSchema.array().optional().nullable(),
  notIn: ImageRoleSchema.array().optional().nullable(),
  not: z.union([ImageRoleSchema, z.lazy(() => NestedEnumImageRoleNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumImageRoleNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumImageRoleNullableFilterObjectSchema).optional()
}).strict();
export const EnumImageRoleNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumImageRoleNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumImageRoleNullableWithAggregatesFilter>;
export const EnumImageRoleNullableWithAggregatesFilterObjectZodSchema = makeSchema();

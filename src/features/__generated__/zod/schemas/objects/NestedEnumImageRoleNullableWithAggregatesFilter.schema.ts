import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumImageRoleNullableFilterObjectSchema as NestedEnumImageRoleNullableFilterObjectSchema } from './NestedEnumImageRoleNullableFilter.schema'

const nestedenumimagerolenullablewithaggregatesfilterSchema = z.object({
  equals: ImageRoleSchema.optional().nullable(),
  in: ImageRoleSchema.array().optional().nullable(),
  notIn: ImageRoleSchema.array().optional().nullable(),
  not: z.union([ImageRoleSchema, z.lazy(() => NestedEnumImageRoleNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumImageRoleNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumImageRoleNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumImageRoleNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumImageRoleNullableWithAggregatesFilter> = nestedenumimagerolenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumImageRoleNullableWithAggregatesFilter>;
export const NestedEnumImageRoleNullableWithAggregatesFilterObjectZodSchema = nestedenumimagerolenullablewithaggregatesfilterSchema;

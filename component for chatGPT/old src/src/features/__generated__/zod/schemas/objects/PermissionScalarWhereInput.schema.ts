import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema'

const permissionscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PermissionScalarWhereInputObjectSchema), z.lazy(() => PermissionScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PermissionScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PermissionScalarWhereInputObjectSchema), z.lazy(() => PermissionScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const PermissionScalarWhereInputObjectSchema: z.ZodType<Prisma.PermissionScalarWhereInput> = permissionscalarwhereinputSchema as unknown as z.ZodType<Prisma.PermissionScalarWhereInput>;
export const PermissionScalarWhereInputObjectZodSchema = permissionscalarwhereinputSchema;

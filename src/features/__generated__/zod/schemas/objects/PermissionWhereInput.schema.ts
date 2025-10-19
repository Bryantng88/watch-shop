import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { RoleListRelationFilterObjectSchema as RoleListRelationFilterObjectSchema } from './RoleListRelationFilter.schema'

const permissionwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PermissionWhereInputObjectSchema), z.lazy(() => PermissionWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PermissionWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PermissionWhereInputObjectSchema), z.lazy(() => PermissionWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  roles: z.lazy(() => RoleListRelationFilterObjectSchema).optional()
}).strict();
export const PermissionWhereInputObjectSchema: z.ZodType<Prisma.PermissionWhereInput> = permissionwhereinputSchema as unknown as z.ZodType<Prisma.PermissionWhereInput>;
export const PermissionWhereInputObjectZodSchema = permissionwhereinputSchema;

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { PermissionListRelationFilterObjectSchema as PermissionListRelationFilterObjectSchema } from './PermissionListRelationFilter.schema';
import { UserListRelationFilterObjectSchema as UserListRelationFilterObjectSchema } from './UserListRelationFilter.schema'

const rolewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => RoleWhereInputObjectSchema), z.lazy(() => RoleWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoleWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoleWhereInputObjectSchema), z.lazy(() => RoleWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  permissions: z.lazy(() => PermissionListRelationFilterObjectSchema).optional(),
  users: z.lazy(() => UserListRelationFilterObjectSchema).optional()
}).strict();
export const RoleWhereInputObjectSchema: z.ZodType<Prisma.RoleWhereInput> = rolewhereinputSchema as unknown as z.ZodType<Prisma.RoleWhereInput>;
export const RoleWhereInputObjectZodSchema = rolewhereinputSchema;

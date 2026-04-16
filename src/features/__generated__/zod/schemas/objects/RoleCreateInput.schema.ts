import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionCreateNestedManyWithoutRoleInputObjectSchema as PermissionCreateNestedManyWithoutRoleInputObjectSchema } from './PermissionCreateNestedManyWithoutRoleInput.schema';
import { UserCreateNestedManyWithoutRoleInputObjectSchema as UserCreateNestedManyWithoutRoleInputObjectSchema } from './UserCreateNestedManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutRoleInputObjectSchema),
  User: z.lazy(() => UserCreateNestedManyWithoutRoleInputObjectSchema)
}).strict();
export const RoleCreateInputObjectSchema: z.ZodType<Prisma.RoleCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateInput>;
export const RoleCreateInputObjectZodSchema = makeSchema();

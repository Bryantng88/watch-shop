import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionCreateNestedManyWithoutRolesInputObjectSchema as PermissionCreateNestedManyWithoutRolesInputObjectSchema } from './PermissionCreateNestedManyWithoutRolesInput.schema';
import { UserCreateNestedManyWithoutRolesInputObjectSchema as UserCreateNestedManyWithoutRolesInputObjectSchema } from './UserCreateNestedManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  permissions: z.lazy(() => PermissionCreateNestedManyWithoutRolesInputObjectSchema),
  users: z.lazy(() => UserCreateNestedManyWithoutRolesInputObjectSchema)
}).strict();
export const RoleCreateInputObjectSchema: z.ZodType<Prisma.RoleCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateInput>;
export const RoleCreateInputObjectZodSchema = makeSchema();

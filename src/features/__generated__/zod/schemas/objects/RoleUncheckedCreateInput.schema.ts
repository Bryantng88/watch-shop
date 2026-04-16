import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema as PermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema } from './PermissionUncheckedCreateNestedManyWithoutRoleInput.schema';
import { UserUncheckedCreateNestedManyWithoutRolesInputObjectSchema as UserUncheckedCreateNestedManyWithoutRolesInputObjectSchema } from './UserUncheckedCreateNestedManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutRolesInputObjectSchema)
}).strict();
export const RoleUncheckedCreateInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateInput>;
export const RoleUncheckedCreateInputObjectZodSchema = makeSchema();

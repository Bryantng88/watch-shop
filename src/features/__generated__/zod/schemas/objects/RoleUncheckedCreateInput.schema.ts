import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema as PermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema } from './PermissionUncheckedCreateNestedManyWithoutRolesInput.schema';
import { UserUncheckedCreateNestedManyWithoutRolesInputObjectSchema as UserUncheckedCreateNestedManyWithoutRolesInputObjectSchema } from './UserUncheckedCreateNestedManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  permissions: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema),
  users: z.lazy(() => UserUncheckedCreateNestedManyWithoutRolesInputObjectSchema)
}).strict();
export const RoleUncheckedCreateInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateInput>;
export const RoleUncheckedCreateInputObjectZodSchema = makeSchema();

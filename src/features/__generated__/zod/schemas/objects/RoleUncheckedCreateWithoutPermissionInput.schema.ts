import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUncheckedCreateNestedManyWithoutRoleInputObjectSchema as UserUncheckedCreateNestedManyWithoutRoleInputObjectSchema } from './UserUncheckedCreateNestedManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutRoleInputObjectSchema).optional()
}).strict();
export const RoleUncheckedCreateWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutPermissionInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateWithoutPermissionInput>;
export const RoleUncheckedCreateWithoutPermissionInputObjectZodSchema = makeSchema();

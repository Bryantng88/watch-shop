import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUncheckedCreateNestedManyWithoutRolesInputObjectSchema as UserUncheckedCreateNestedManyWithoutRolesInputObjectSchema } from './UserUncheckedCreateNestedManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  users: z.lazy(() => UserUncheckedCreateNestedManyWithoutRolesInputObjectSchema).optional()
}).strict();
export const RoleUncheckedCreateWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateWithoutPermissionsInput>;
export const RoleUncheckedCreateWithoutPermissionsInputObjectZodSchema = makeSchema();

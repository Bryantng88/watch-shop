import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateNestedManyWithoutRolesInputObjectSchema as UserCreateNestedManyWithoutRolesInputObjectSchema } from './UserCreateNestedManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  users: z.lazy(() => UserCreateNestedManyWithoutRolesInputObjectSchema).optional()
}).strict();
export const RoleCreateWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.RoleCreateWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateWithoutPermissionsInput>;
export const RoleCreateWithoutPermissionsInputObjectZodSchema = makeSchema();

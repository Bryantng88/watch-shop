import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateNestedManyWithoutRolesInputObjectSchema as UserCreateNestedManyWithoutRolesInputObjectSchema } from './UserCreateNestedManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  User: z.lazy(() => UserCreateNestedManyWithoutRolesInputObjectSchema).optional()
}).strict();
export const RoleCreateWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RoleCreateWithoutPermissionInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateWithoutPermissionInput>;
export const RoleCreateWithoutPermissionInputObjectZodSchema = makeSchema();

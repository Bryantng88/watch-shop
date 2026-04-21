import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionCreateNestedManyWithoutRolesInputObjectSchema as PermissionCreateNestedManyWithoutRolesInputObjectSchema } from './PermissionCreateNestedManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  permissions: z.lazy(() => PermissionCreateNestedManyWithoutRolesInputObjectSchema).optional()
}).strict();
export const RoleCreateWithoutUsersInputObjectSchema: z.ZodType<Prisma.RoleCreateWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateWithoutUsersInput>;
export const RoleCreateWithoutUsersInputObjectZodSchema = makeSchema();

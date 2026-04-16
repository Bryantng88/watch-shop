import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema as PermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema } from './PermissionUncheckedCreateNestedManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  permissions: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema).optional()
}).strict();
export const RoleUncheckedCreateWithoutUsersInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateWithoutUsersInput>;
export const RoleUncheckedCreateWithoutUsersInputObjectZodSchema = makeSchema();

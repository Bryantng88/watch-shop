import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleUncheckedCreateNestedManyWithoutPermissionsInputObjectSchema as RoleUncheckedCreateNestedManyWithoutPermissionsInputObjectSchema } from './RoleUncheckedCreateNestedManyWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  description: z.string().optional().nullable(),
  roles: z.lazy(() => RoleUncheckedCreateNestedManyWithoutPermissionsInputObjectSchema)
}).strict();
export const PermissionUncheckedCreateInputObjectSchema: z.ZodType<Prisma.PermissionUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUncheckedCreateInput>;
export const PermissionUncheckedCreateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateNestedManyWithoutPermissionsInputObjectSchema as RoleCreateNestedManyWithoutPermissionsInputObjectSchema } from './RoleCreateNestedManyWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  description: z.string().optional().nullable(),
  roles: z.lazy(() => RoleCreateNestedManyWithoutPermissionsInputObjectSchema)
}).strict();
export const PermissionCreateInputObjectSchema: z.ZodType<Prisma.PermissionCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateInput>;
export const PermissionCreateInputObjectZodSchema = makeSchema();

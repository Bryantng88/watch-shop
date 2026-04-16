import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateNestedManyWithoutPermissionInputObjectSchema as RoleCreateNestedManyWithoutPermissionInputObjectSchema } from './RoleCreateNestedManyWithoutPermissionInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  code: z.string(),
  description: z.string().optional().nullable(),
  Role: z.lazy(() => RoleCreateNestedManyWithoutPermissionInputObjectSchema)
}).strict();
export const PermissionCreateInputObjectSchema: z.ZodType<Prisma.PermissionCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateInput>;
export const PermissionCreateInputObjectZodSchema = makeSchema();

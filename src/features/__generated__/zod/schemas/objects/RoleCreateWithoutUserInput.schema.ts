import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionCreateNestedManyWithoutRoleInputObjectSchema as PermissionCreateNestedManyWithoutRoleInputObjectSchema } from './PermissionCreateNestedManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutRoleInputObjectSchema).optional()
}).strict();
export const RoleCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.RoleCreateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateWithoutUserInput>;
export const RoleCreateWithoutUserInputObjectZodSchema = makeSchema();

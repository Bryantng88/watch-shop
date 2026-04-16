import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema as PermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema } from './PermissionUncheckedCreateNestedManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema).optional()
}).strict();
export const RoleUncheckedCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateWithoutUserInput>;
export const RoleUncheckedCreateWithoutUserInputObjectZodSchema = makeSchema();

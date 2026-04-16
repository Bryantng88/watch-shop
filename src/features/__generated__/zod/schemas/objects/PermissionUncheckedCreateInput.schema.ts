import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleUncheckedCreateNestedManyWithoutPermissionInputObjectSchema as RoleUncheckedCreateNestedManyWithoutPermissionInputObjectSchema } from './RoleUncheckedCreateNestedManyWithoutPermissionInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  code: z.string(),
  description: z.string().optional().nullable(),
  Role: z.lazy(() => RoleUncheckedCreateNestedManyWithoutPermissionInputObjectSchema)
}).strict();
export const PermissionUncheckedCreateInputObjectSchema: z.ZodType<Prisma.PermissionUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUncheckedCreateInput>;
export const PermissionUncheckedCreateInputObjectZodSchema = makeSchema();

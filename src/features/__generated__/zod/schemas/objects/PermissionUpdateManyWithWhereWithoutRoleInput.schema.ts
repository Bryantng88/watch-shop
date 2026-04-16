import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionScalarWhereInputObjectSchema as PermissionScalarWhereInputObjectSchema } from './PermissionScalarWhereInput.schema';
import { PermissionUpdateManyMutationInputObjectSchema as PermissionUpdateManyMutationInputObjectSchema } from './PermissionUpdateManyMutationInput.schema';
import { PermissionUncheckedUpdateManyWithoutRoleInputObjectSchema as PermissionUncheckedUpdateManyWithoutRoleInputObjectSchema } from './PermissionUncheckedUpdateManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PermissionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PermissionUpdateManyMutationInputObjectSchema), z.lazy(() => PermissionUncheckedUpdateManyWithoutRoleInputObjectSchema)])
}).strict();
export const PermissionUpdateManyWithWhereWithoutRoleInputObjectSchema: z.ZodType<Prisma.PermissionUpdateManyWithWhereWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUpdateManyWithWhereWithoutRoleInput>;
export const PermissionUpdateManyWithWhereWithoutRoleInputObjectZodSchema = makeSchema();

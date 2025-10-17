import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionScalarWhereInputObjectSchema as PermissionScalarWhereInputObjectSchema } from './PermissionScalarWhereInput.schema';
import { PermissionUpdateManyMutationInputObjectSchema as PermissionUpdateManyMutationInputObjectSchema } from './PermissionUpdateManyMutationInput.schema';
import { PermissionUncheckedUpdateManyWithoutRolesInputObjectSchema as PermissionUncheckedUpdateManyWithoutRolesInputObjectSchema } from './PermissionUncheckedUpdateManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PermissionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PermissionUpdateManyMutationInputObjectSchema), z.lazy(() => PermissionUncheckedUpdateManyWithoutRolesInputObjectSchema)])
}).strict();
export const PermissionUpdateManyWithWhereWithoutRolesInputObjectSchema: z.ZodType<Prisma.PermissionUpdateManyWithWhereWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUpdateManyWithWhereWithoutRolesInput>;
export const PermissionUpdateManyWithWhereWithoutRolesInputObjectZodSchema = makeSchema();

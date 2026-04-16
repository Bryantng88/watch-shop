import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleScalarWhereInputObjectSchema as RoleScalarWhereInputObjectSchema } from './RoleScalarWhereInput.schema';
import { RoleUpdateManyMutationInputObjectSchema as RoleUpdateManyMutationInputObjectSchema } from './RoleUpdateManyMutationInput.schema';
import { RoleUncheckedUpdateManyWithoutPermissionInputObjectSchema as RoleUncheckedUpdateManyWithoutPermissionInputObjectSchema } from './RoleUncheckedUpdateManyWithoutPermissionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RoleUpdateManyMutationInputObjectSchema), z.lazy(() => RoleUncheckedUpdateManyWithoutPermissionInputObjectSchema)])
}).strict();
export const RoleUpdateManyWithWhereWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutPermissionInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutPermissionInput>;
export const RoleUpdateManyWithWhereWithoutPermissionInputObjectZodSchema = makeSchema();

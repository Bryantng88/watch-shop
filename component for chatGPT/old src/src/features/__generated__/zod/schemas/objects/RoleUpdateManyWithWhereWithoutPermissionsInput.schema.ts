import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleScalarWhereInputObjectSchema as RoleScalarWhereInputObjectSchema } from './RoleScalarWhereInput.schema';
import { RoleUpdateManyMutationInputObjectSchema as RoleUpdateManyMutationInputObjectSchema } from './RoleUpdateManyMutationInput.schema';
import { RoleUncheckedUpdateManyWithoutPermissionsInputObjectSchema as RoleUncheckedUpdateManyWithoutPermissionsInputObjectSchema } from './RoleUncheckedUpdateManyWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RoleUpdateManyMutationInputObjectSchema), z.lazy(() => RoleUncheckedUpdateManyWithoutPermissionsInputObjectSchema)])
}).strict();
export const RoleUpdateManyWithWhereWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutPermissionsInput>;
export const RoleUpdateManyWithWhereWithoutPermissionsInputObjectZodSchema = makeSchema();

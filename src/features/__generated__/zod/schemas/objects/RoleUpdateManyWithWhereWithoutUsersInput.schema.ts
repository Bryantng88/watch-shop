import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleScalarWhereInputObjectSchema as RoleScalarWhereInputObjectSchema } from './RoleScalarWhereInput.schema';
import { RoleUpdateManyMutationInputObjectSchema as RoleUpdateManyMutationInputObjectSchema } from './RoleUpdateManyMutationInput.schema';
import { RoleUncheckedUpdateManyWithoutUsersInputObjectSchema as RoleUncheckedUpdateManyWithoutUsersInputObjectSchema } from './RoleUncheckedUpdateManyWithoutUsersInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RoleUpdateManyMutationInputObjectSchema), z.lazy(() => RoleUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
export const RoleUpdateManyWithWhereWithoutUsersInputObjectSchema: z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutUsersInput>;
export const RoleUpdateManyWithWhereWithoutUsersInputObjectZodSchema = makeSchema();

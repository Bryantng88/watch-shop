import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserScalarWhereInputObjectSchema as UserScalarWhereInputObjectSchema } from './UserScalarWhereInput.schema';
import { UserUpdateManyMutationInputObjectSchema as UserUpdateManyMutationInputObjectSchema } from './UserUpdateManyMutationInput.schema';
import { UserUncheckedUpdateManyWithoutRoleInputObjectSchema as UserUncheckedUpdateManyWithoutRoleInputObjectSchema } from './UserUncheckedUpdateManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => UserUpdateManyMutationInputObjectSchema), z.lazy(() => UserUncheckedUpdateManyWithoutRoleInputObjectSchema)])
}).strict();
export const UserUpdateManyWithWhereWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateManyWithWhereWithoutRoleInput>;
export const UserUpdateManyWithWhereWithoutRoleInputObjectZodSchema = makeSchema();

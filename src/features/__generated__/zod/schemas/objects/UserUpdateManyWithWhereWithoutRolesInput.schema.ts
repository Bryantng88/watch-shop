import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserScalarWhereInputObjectSchema as UserScalarWhereInputObjectSchema } from './UserScalarWhereInput.schema';
import { UserUpdateManyMutationInputObjectSchema as UserUpdateManyMutationInputObjectSchema } from './UserUpdateManyMutationInput.schema';
import { UserUncheckedUpdateManyWithoutRolesInputObjectSchema as UserUncheckedUpdateManyWithoutRolesInputObjectSchema } from './UserUncheckedUpdateManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => UserUpdateManyMutationInputObjectSchema), z.lazy(() => UserUncheckedUpdateManyWithoutRolesInputObjectSchema)])
}).strict();
export const UserUpdateManyWithWhereWithoutRolesInputObjectSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateManyWithWhereWithoutRolesInput>;
export const UserUpdateManyWithWhereWithoutRolesInputObjectZodSchema = makeSchema();

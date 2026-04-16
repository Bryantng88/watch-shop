import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutRoleInputObjectSchema as UserCreateWithoutRoleInputObjectSchema } from './UserCreateWithoutRoleInput.schema';
import { UserUncheckedCreateWithoutRoleInputObjectSchema as UserUncheckedCreateWithoutRoleInputObjectSchema } from './UserUncheckedCreateWithoutRoleInput.schema';
import { UserCreateOrConnectWithoutRoleInputObjectSchema as UserCreateOrConnectWithoutRoleInputObjectSchema } from './UserCreateOrConnectWithoutRoleInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutRoleInputObjectSchema), z.lazy(() => UserCreateWithoutRoleInputObjectSchema).array(), z.lazy(() => UserUncheckedCreateWithoutRoleInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRoleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UserCreateOrConnectWithoutRoleInputObjectSchema), z.lazy(() => UserCreateOrConnectWithoutRoleInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UserWhereUniqueInputObjectSchema), z.lazy(() => UserWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const UserUncheckedCreateNestedManyWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutRoleInput>;
export const UserUncheckedCreateNestedManyWithoutRoleInputObjectZodSchema = makeSchema();

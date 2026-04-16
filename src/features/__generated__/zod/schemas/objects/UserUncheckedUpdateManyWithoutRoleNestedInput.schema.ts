import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutRoleInputObjectSchema as UserCreateWithoutRoleInputObjectSchema } from './UserCreateWithoutRoleInput.schema';
import { UserUncheckedCreateWithoutRoleInputObjectSchema as UserUncheckedCreateWithoutRoleInputObjectSchema } from './UserUncheckedCreateWithoutRoleInput.schema';
import { UserCreateOrConnectWithoutRoleInputObjectSchema as UserCreateOrConnectWithoutRoleInputObjectSchema } from './UserCreateOrConnectWithoutRoleInput.schema';
import { UserUpsertWithWhereUniqueWithoutRoleInputObjectSchema as UserUpsertWithWhereUniqueWithoutRoleInputObjectSchema } from './UserUpsertWithWhereUniqueWithoutRoleInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithWhereUniqueWithoutRoleInputObjectSchema as UserUpdateWithWhereUniqueWithoutRoleInputObjectSchema } from './UserUpdateWithWhereUniqueWithoutRoleInput.schema';
import { UserUpdateManyWithWhereWithoutRoleInputObjectSchema as UserUpdateManyWithWhereWithoutRoleInputObjectSchema } from './UserUpdateManyWithWhereWithoutRoleInput.schema';
import { UserScalarWhereInputObjectSchema as UserScalarWhereInputObjectSchema } from './UserScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutRoleInputObjectSchema), z.lazy(() => UserCreateWithoutRoleInputObjectSchema).array(), z.lazy(() => UserUncheckedCreateWithoutRoleInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRoleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UserCreateOrConnectWithoutRoleInputObjectSchema), z.lazy(() => UserCreateOrConnectWithoutRoleInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => UserUpsertWithWhereUniqueWithoutRoleInputObjectSchema), z.lazy(() => UserUpsertWithWhereUniqueWithoutRoleInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => UserWhereUniqueInputObjectSchema), z.lazy(() => UserWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => UserWhereUniqueInputObjectSchema), z.lazy(() => UserWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => UserWhereUniqueInputObjectSchema), z.lazy(() => UserWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UserWhereUniqueInputObjectSchema), z.lazy(() => UserWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => UserUpdateWithWhereUniqueWithoutRoleInputObjectSchema), z.lazy(() => UserUpdateWithWhereUniqueWithoutRoleInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => UserUpdateManyWithWhereWithoutRoleInputObjectSchema), z.lazy(() => UserUpdateManyWithWhereWithoutRoleInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => UserScalarWhereInputObjectSchema), z.lazy(() => UserScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const UserUncheckedUpdateManyWithoutRoleNestedInputObjectSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutRoleNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedUpdateManyWithoutRoleNestedInput>;
export const UserUncheckedUpdateManyWithoutRoleNestedInputObjectZodSchema = makeSchema();

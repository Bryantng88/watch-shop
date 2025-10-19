import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutRolesInputObjectSchema as UserCreateWithoutRolesInputObjectSchema } from './UserCreateWithoutRolesInput.schema';
import { UserUncheckedCreateWithoutRolesInputObjectSchema as UserUncheckedCreateWithoutRolesInputObjectSchema } from './UserUncheckedCreateWithoutRolesInput.schema';
import { UserCreateOrConnectWithoutRolesInputObjectSchema as UserCreateOrConnectWithoutRolesInputObjectSchema } from './UserCreateOrConnectWithoutRolesInput.schema';
import { UserUpsertWithWhereUniqueWithoutRolesInputObjectSchema as UserUpsertWithWhereUniqueWithoutRolesInputObjectSchema } from './UserUpsertWithWhereUniqueWithoutRolesInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithWhereUniqueWithoutRolesInputObjectSchema as UserUpdateWithWhereUniqueWithoutRolesInputObjectSchema } from './UserUpdateWithWhereUniqueWithoutRolesInput.schema';
import { UserUpdateManyWithWhereWithoutRolesInputObjectSchema as UserUpdateManyWithWhereWithoutRolesInputObjectSchema } from './UserUpdateManyWithWhereWithoutRolesInput.schema';
import { UserScalarWhereInputObjectSchema as UserScalarWhereInputObjectSchema } from './UserScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutRolesInputObjectSchema), z.lazy(() => UserCreateWithoutRolesInputObjectSchema).array(), z.lazy(() => UserUncheckedCreateWithoutRolesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRolesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UserCreateOrConnectWithoutRolesInputObjectSchema), z.lazy(() => UserCreateOrConnectWithoutRolesInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => UserUpsertWithWhereUniqueWithoutRolesInputObjectSchema), z.lazy(() => UserUpsertWithWhereUniqueWithoutRolesInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => UserWhereUniqueInputObjectSchema), z.lazy(() => UserWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => UserWhereUniqueInputObjectSchema), z.lazy(() => UserWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => UserWhereUniqueInputObjectSchema), z.lazy(() => UserWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UserWhereUniqueInputObjectSchema), z.lazy(() => UserWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => UserUpdateWithWhereUniqueWithoutRolesInputObjectSchema), z.lazy(() => UserUpdateWithWhereUniqueWithoutRolesInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => UserUpdateManyWithWhereWithoutRolesInputObjectSchema), z.lazy(() => UserUpdateManyWithWhereWithoutRolesInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => UserScalarWhereInputObjectSchema), z.lazy(() => UserScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const UserUpdateManyWithoutRolesNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateManyWithoutRolesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateManyWithoutRolesNestedInput>;
export const UserUpdateManyWithoutRolesNestedInputObjectZodSchema = makeSchema();

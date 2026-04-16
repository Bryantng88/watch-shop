import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithoutRoleInputObjectSchema as UserUpdateWithoutRoleInputObjectSchema } from './UserUpdateWithoutRoleInput.schema';
import { UserUncheckedUpdateWithoutRoleInputObjectSchema as UserUncheckedUpdateWithoutRoleInputObjectSchema } from './UserUncheckedUpdateWithoutRoleInput.schema';
import { UserCreateWithoutRoleInputObjectSchema as UserCreateWithoutRoleInputObjectSchema } from './UserCreateWithoutRoleInput.schema';
import { UserUncheckedCreateWithoutRoleInputObjectSchema as UserUncheckedCreateWithoutRoleInputObjectSchema } from './UserUncheckedCreateWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => UserUpdateWithoutRoleInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutRoleInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutRoleInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRoleInputObjectSchema)])
}).strict();
export const UserUpsertWithWhereUniqueWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutRoleInput>;
export const UserUpsertWithWhereUniqueWithoutRoleInputObjectZodSchema = makeSchema();

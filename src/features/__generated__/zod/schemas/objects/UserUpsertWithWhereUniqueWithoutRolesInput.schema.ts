import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithoutRolesInputObjectSchema as UserUpdateWithoutRolesInputObjectSchema } from './UserUpdateWithoutRolesInput.schema';
import { UserUncheckedUpdateWithoutRolesInputObjectSchema as UserUncheckedUpdateWithoutRolesInputObjectSchema } from './UserUncheckedUpdateWithoutRolesInput.schema';
import { UserCreateWithoutRolesInputObjectSchema as UserCreateWithoutRolesInputObjectSchema } from './UserCreateWithoutRolesInput.schema';
import { UserUncheckedCreateWithoutRolesInputObjectSchema as UserUncheckedCreateWithoutRolesInputObjectSchema } from './UserUncheckedCreateWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => UserUpdateWithoutRolesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutRolesInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutRolesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRolesInputObjectSchema)])
}).strict();
export const UserUpsertWithWhereUniqueWithoutRolesInputObjectSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutRolesInput>;
export const UserUpsertWithWhereUniqueWithoutRolesInputObjectZodSchema = makeSchema();

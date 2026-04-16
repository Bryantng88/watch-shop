import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutRoleInputObjectSchema as UserCreateWithoutRoleInputObjectSchema } from './UserCreateWithoutRoleInput.schema';
import { UserUncheckedCreateWithoutRoleInputObjectSchema as UserUncheckedCreateWithoutRoleInputObjectSchema } from './UserUncheckedCreateWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutRoleInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRoleInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutRoleInput>;
export const UserCreateOrConnectWithoutRoleInputObjectZodSchema = makeSchema();

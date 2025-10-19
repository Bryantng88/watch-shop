import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutRolesInputObjectSchema as UserCreateWithoutRolesInputObjectSchema } from './UserCreateWithoutRolesInput.schema';
import { UserUncheckedCreateWithoutRolesInputObjectSchema as UserUncheckedCreateWithoutRolesInputObjectSchema } from './UserUncheckedCreateWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutRolesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRolesInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutRolesInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutRolesInput>;
export const UserCreateOrConnectWithoutRolesInputObjectZodSchema = makeSchema();

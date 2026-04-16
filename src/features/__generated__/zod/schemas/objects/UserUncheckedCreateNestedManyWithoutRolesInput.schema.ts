import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutRolesInputObjectSchema as UserCreateWithoutRolesInputObjectSchema } from './UserCreateWithoutRolesInput.schema';
import { UserUncheckedCreateWithoutRolesInputObjectSchema as UserUncheckedCreateWithoutRolesInputObjectSchema } from './UserUncheckedCreateWithoutRolesInput.schema';
import { UserCreateOrConnectWithoutRolesInputObjectSchema as UserCreateOrConnectWithoutRolesInputObjectSchema } from './UserCreateOrConnectWithoutRolesInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutRolesInputObjectSchema), z.lazy(() => UserCreateWithoutRolesInputObjectSchema).array(), z.lazy(() => UserUncheckedCreateWithoutRolesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRolesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => UserCreateOrConnectWithoutRolesInputObjectSchema), z.lazy(() => UserCreateOrConnectWithoutRolesInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => UserWhereUniqueInputObjectSchema), z.lazy(() => UserWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const UserUncheckedCreateNestedManyWithoutRolesInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutRolesInput>;
export const UserUncheckedCreateNestedManyWithoutRolesInputObjectZodSchema = makeSchema();

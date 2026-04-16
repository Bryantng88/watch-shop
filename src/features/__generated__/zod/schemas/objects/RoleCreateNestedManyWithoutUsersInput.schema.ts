import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateWithoutUsersInputObjectSchema as RoleCreateWithoutUsersInputObjectSchema } from './RoleCreateWithoutUsersInput.schema';
import { RoleUncheckedCreateWithoutUsersInputObjectSchema as RoleUncheckedCreateWithoutUsersInputObjectSchema } from './RoleUncheckedCreateWithoutUsersInput.schema';
import { RoleCreateOrConnectWithoutUsersInputObjectSchema as RoleCreateOrConnectWithoutUsersInputObjectSchema } from './RoleCreateOrConnectWithoutUsersInput.schema';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RoleCreateWithoutUsersInputObjectSchema), z.lazy(() => RoleCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => RoleUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoleCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => RoleCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const RoleCreateNestedManyWithoutUsersInputObjectSchema: z.ZodType<Prisma.RoleCreateNestedManyWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateNestedManyWithoutUsersInput>;
export const RoleCreateNestedManyWithoutUsersInputObjectZodSchema = makeSchema();

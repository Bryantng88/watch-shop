import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleCreateWithoutUsersInputObjectSchema as RoleCreateWithoutUsersInputObjectSchema } from './RoleCreateWithoutUsersInput.schema';
import { RoleUncheckedCreateWithoutUsersInputObjectSchema as RoleUncheckedCreateWithoutUsersInputObjectSchema } from './RoleUncheckedCreateWithoutUsersInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoleCreateWithoutUsersInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const RoleCreateOrConnectWithoutUsersInputObjectSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateOrConnectWithoutUsersInput>;
export const RoleCreateOrConnectWithoutUsersInputObjectZodSchema = makeSchema();

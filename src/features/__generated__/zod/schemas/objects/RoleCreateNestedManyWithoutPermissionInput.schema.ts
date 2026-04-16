import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateWithoutPermissionInputObjectSchema as RoleCreateWithoutPermissionInputObjectSchema } from './RoleCreateWithoutPermissionInput.schema';
import { RoleUncheckedCreateWithoutPermissionInputObjectSchema as RoleUncheckedCreateWithoutPermissionInputObjectSchema } from './RoleUncheckedCreateWithoutPermissionInput.schema';
import { RoleCreateOrConnectWithoutPermissionInputObjectSchema as RoleCreateOrConnectWithoutPermissionInputObjectSchema } from './RoleCreateOrConnectWithoutPermissionInput.schema';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RoleCreateWithoutPermissionInputObjectSchema), z.lazy(() => RoleCreateWithoutPermissionInputObjectSchema).array(), z.lazy(() => RoleUncheckedCreateWithoutPermissionInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutPermissionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoleCreateOrConnectWithoutPermissionInputObjectSchema), z.lazy(() => RoleCreateOrConnectWithoutPermissionInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const RoleCreateNestedManyWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RoleCreateNestedManyWithoutPermissionInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateNestedManyWithoutPermissionInput>;
export const RoleCreateNestedManyWithoutPermissionInputObjectZodSchema = makeSchema();

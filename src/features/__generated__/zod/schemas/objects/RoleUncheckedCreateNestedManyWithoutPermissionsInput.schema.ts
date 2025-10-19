import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateWithoutPermissionsInputObjectSchema as RoleCreateWithoutPermissionsInputObjectSchema } from './RoleCreateWithoutPermissionsInput.schema';
import { RoleUncheckedCreateWithoutPermissionsInputObjectSchema as RoleUncheckedCreateWithoutPermissionsInputObjectSchema } from './RoleUncheckedCreateWithoutPermissionsInput.schema';
import { RoleCreateOrConnectWithoutPermissionsInputObjectSchema as RoleCreateOrConnectWithoutPermissionsInputObjectSchema } from './RoleCreateOrConnectWithoutPermissionsInput.schema';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RoleCreateWithoutPermissionsInputObjectSchema), z.lazy(() => RoleCreateWithoutPermissionsInputObjectSchema).array(), z.lazy(() => RoleUncheckedCreateWithoutPermissionsInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutPermissionsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoleCreateOrConnectWithoutPermissionsInputObjectSchema), z.lazy(() => RoleCreateOrConnectWithoutPermissionsInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const RoleUncheckedCreateNestedManyWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateNestedManyWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateNestedManyWithoutPermissionsInput>;
export const RoleUncheckedCreateNestedManyWithoutPermissionsInputObjectZodSchema = makeSchema();

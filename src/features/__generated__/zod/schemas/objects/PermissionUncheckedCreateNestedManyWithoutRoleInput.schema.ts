import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionCreateWithoutRoleInputObjectSchema as PermissionCreateWithoutRoleInputObjectSchema } from './PermissionCreateWithoutRoleInput.schema';
import { PermissionUncheckedCreateWithoutRoleInputObjectSchema as PermissionUncheckedCreateWithoutRoleInputObjectSchema } from './PermissionUncheckedCreateWithoutRoleInput.schema';
import { PermissionCreateOrConnectWithoutRoleInputObjectSchema as PermissionCreateOrConnectWithoutRoleInputObjectSchema } from './PermissionCreateOrConnectWithoutRoleInput.schema';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './PermissionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PermissionCreateWithoutRoleInputObjectSchema), z.lazy(() => PermissionCreateWithoutRoleInputObjectSchema).array(), z.lazy(() => PermissionUncheckedCreateWithoutRoleInputObjectSchema), z.lazy(() => PermissionUncheckedCreateWithoutRoleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PermissionCreateOrConnectWithoutRoleInputObjectSchema), z.lazy(() => PermissionCreateOrConnectWithoutRoleInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PermissionWhereUniqueInputObjectSchema), z.lazy(() => PermissionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema: z.ZodType<Prisma.PermissionUncheckedCreateNestedManyWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUncheckedCreateNestedManyWithoutRoleInput>;
export const PermissionUncheckedCreateNestedManyWithoutRoleInputObjectZodSchema = makeSchema();

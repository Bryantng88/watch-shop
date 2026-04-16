import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionCreateWithoutRolesInputObjectSchema as PermissionCreateWithoutRolesInputObjectSchema } from './PermissionCreateWithoutRolesInput.schema';
import { PermissionUncheckedCreateWithoutRolesInputObjectSchema as PermissionUncheckedCreateWithoutRolesInputObjectSchema } from './PermissionUncheckedCreateWithoutRolesInput.schema';
import { PermissionCreateOrConnectWithoutRolesInputObjectSchema as PermissionCreateOrConnectWithoutRolesInputObjectSchema } from './PermissionCreateOrConnectWithoutRolesInput.schema';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './PermissionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PermissionCreateWithoutRolesInputObjectSchema), z.lazy(() => PermissionCreateWithoutRolesInputObjectSchema).array(), z.lazy(() => PermissionUncheckedCreateWithoutRolesInputObjectSchema), z.lazy(() => PermissionUncheckedCreateWithoutRolesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PermissionCreateOrConnectWithoutRolesInputObjectSchema), z.lazy(() => PermissionCreateOrConnectWithoutRolesInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PermissionWhereUniqueInputObjectSchema), z.lazy(() => PermissionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PermissionCreateNestedManyWithoutRolesInputObjectSchema: z.ZodType<Prisma.PermissionCreateNestedManyWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateNestedManyWithoutRolesInput>;
export const PermissionCreateNestedManyWithoutRolesInputObjectZodSchema = makeSchema();

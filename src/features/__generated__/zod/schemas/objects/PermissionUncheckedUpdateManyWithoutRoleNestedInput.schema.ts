import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionCreateWithoutRoleInputObjectSchema as PermissionCreateWithoutRoleInputObjectSchema } from './PermissionCreateWithoutRoleInput.schema';
import { PermissionUncheckedCreateWithoutRoleInputObjectSchema as PermissionUncheckedCreateWithoutRoleInputObjectSchema } from './PermissionUncheckedCreateWithoutRoleInput.schema';
import { PermissionCreateOrConnectWithoutRoleInputObjectSchema as PermissionCreateOrConnectWithoutRoleInputObjectSchema } from './PermissionCreateOrConnectWithoutRoleInput.schema';
import { PermissionUpsertWithWhereUniqueWithoutRoleInputObjectSchema as PermissionUpsertWithWhereUniqueWithoutRoleInputObjectSchema } from './PermissionUpsertWithWhereUniqueWithoutRoleInput.schema';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './PermissionWhereUniqueInput.schema';
import { PermissionUpdateWithWhereUniqueWithoutRoleInputObjectSchema as PermissionUpdateWithWhereUniqueWithoutRoleInputObjectSchema } from './PermissionUpdateWithWhereUniqueWithoutRoleInput.schema';
import { PermissionUpdateManyWithWhereWithoutRoleInputObjectSchema as PermissionUpdateManyWithWhereWithoutRoleInputObjectSchema } from './PermissionUpdateManyWithWhereWithoutRoleInput.schema';
import { PermissionScalarWhereInputObjectSchema as PermissionScalarWhereInputObjectSchema } from './PermissionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PermissionCreateWithoutRoleInputObjectSchema), z.lazy(() => PermissionCreateWithoutRoleInputObjectSchema).array(), z.lazy(() => PermissionUncheckedCreateWithoutRoleInputObjectSchema), z.lazy(() => PermissionUncheckedCreateWithoutRoleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PermissionCreateOrConnectWithoutRoleInputObjectSchema), z.lazy(() => PermissionCreateOrConnectWithoutRoleInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PermissionUpsertWithWhereUniqueWithoutRoleInputObjectSchema), z.lazy(() => PermissionUpsertWithWhereUniqueWithoutRoleInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => PermissionWhereUniqueInputObjectSchema), z.lazy(() => PermissionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PermissionWhereUniqueInputObjectSchema), z.lazy(() => PermissionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PermissionWhereUniqueInputObjectSchema), z.lazy(() => PermissionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PermissionWhereUniqueInputObjectSchema), z.lazy(() => PermissionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PermissionUpdateWithWhereUniqueWithoutRoleInputObjectSchema), z.lazy(() => PermissionUpdateWithWhereUniqueWithoutRoleInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PermissionUpdateManyWithWhereWithoutRoleInputObjectSchema), z.lazy(() => PermissionUpdateManyWithWhereWithoutRoleInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PermissionScalarWhereInputObjectSchema), z.lazy(() => PermissionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PermissionUncheckedUpdateManyWithoutRoleNestedInputObjectSchema: z.ZodType<Prisma.PermissionUncheckedUpdateManyWithoutRoleNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUncheckedUpdateManyWithoutRoleNestedInput>;
export const PermissionUncheckedUpdateManyWithoutRoleNestedInputObjectZodSchema = makeSchema();

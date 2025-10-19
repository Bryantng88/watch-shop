import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionCreateWithoutRolesInputObjectSchema as PermissionCreateWithoutRolesInputObjectSchema } from './PermissionCreateWithoutRolesInput.schema';
import { PermissionUncheckedCreateWithoutRolesInputObjectSchema as PermissionUncheckedCreateWithoutRolesInputObjectSchema } from './PermissionUncheckedCreateWithoutRolesInput.schema';
import { PermissionCreateOrConnectWithoutRolesInputObjectSchema as PermissionCreateOrConnectWithoutRolesInputObjectSchema } from './PermissionCreateOrConnectWithoutRolesInput.schema';
import { PermissionUpsertWithWhereUniqueWithoutRolesInputObjectSchema as PermissionUpsertWithWhereUniqueWithoutRolesInputObjectSchema } from './PermissionUpsertWithWhereUniqueWithoutRolesInput.schema';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './PermissionWhereUniqueInput.schema';
import { PermissionUpdateWithWhereUniqueWithoutRolesInputObjectSchema as PermissionUpdateWithWhereUniqueWithoutRolesInputObjectSchema } from './PermissionUpdateWithWhereUniqueWithoutRolesInput.schema';
import { PermissionUpdateManyWithWhereWithoutRolesInputObjectSchema as PermissionUpdateManyWithWhereWithoutRolesInputObjectSchema } from './PermissionUpdateManyWithWhereWithoutRolesInput.schema';
import { PermissionScalarWhereInputObjectSchema as PermissionScalarWhereInputObjectSchema } from './PermissionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PermissionCreateWithoutRolesInputObjectSchema), z.lazy(() => PermissionCreateWithoutRolesInputObjectSchema).array(), z.lazy(() => PermissionUncheckedCreateWithoutRolesInputObjectSchema), z.lazy(() => PermissionUncheckedCreateWithoutRolesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PermissionCreateOrConnectWithoutRolesInputObjectSchema), z.lazy(() => PermissionCreateOrConnectWithoutRolesInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PermissionUpsertWithWhereUniqueWithoutRolesInputObjectSchema), z.lazy(() => PermissionUpsertWithWhereUniqueWithoutRolesInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => PermissionWhereUniqueInputObjectSchema), z.lazy(() => PermissionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PermissionWhereUniqueInputObjectSchema), z.lazy(() => PermissionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PermissionWhereUniqueInputObjectSchema), z.lazy(() => PermissionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PermissionWhereUniqueInputObjectSchema), z.lazy(() => PermissionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PermissionUpdateWithWhereUniqueWithoutRolesInputObjectSchema), z.lazy(() => PermissionUpdateWithWhereUniqueWithoutRolesInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PermissionUpdateManyWithWhereWithoutRolesInputObjectSchema), z.lazy(() => PermissionUpdateManyWithWhereWithoutRolesInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PermissionScalarWhereInputObjectSchema), z.lazy(() => PermissionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PermissionUpdateManyWithoutRolesNestedInputObjectSchema: z.ZodType<Prisma.PermissionUpdateManyWithoutRolesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUpdateManyWithoutRolesNestedInput>;
export const PermissionUpdateManyWithoutRolesNestedInputObjectZodSchema = makeSchema();

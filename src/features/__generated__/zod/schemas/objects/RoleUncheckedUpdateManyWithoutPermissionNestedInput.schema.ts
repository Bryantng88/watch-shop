import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateWithoutPermissionInputObjectSchema as RoleCreateWithoutPermissionInputObjectSchema } from './RoleCreateWithoutPermissionInput.schema';
import { RoleUncheckedCreateWithoutPermissionInputObjectSchema as RoleUncheckedCreateWithoutPermissionInputObjectSchema } from './RoleUncheckedCreateWithoutPermissionInput.schema';
import { RoleCreateOrConnectWithoutPermissionInputObjectSchema as RoleCreateOrConnectWithoutPermissionInputObjectSchema } from './RoleCreateOrConnectWithoutPermissionInput.schema';
import { RoleUpsertWithWhereUniqueWithoutPermissionInputObjectSchema as RoleUpsertWithWhereUniqueWithoutPermissionInputObjectSchema } from './RoleUpsertWithWhereUniqueWithoutPermissionInput.schema';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithWhereUniqueWithoutPermissionInputObjectSchema as RoleUpdateWithWhereUniqueWithoutPermissionInputObjectSchema } from './RoleUpdateWithWhereUniqueWithoutPermissionInput.schema';
import { RoleUpdateManyWithWhereWithoutPermissionInputObjectSchema as RoleUpdateManyWithWhereWithoutPermissionInputObjectSchema } from './RoleUpdateManyWithWhereWithoutPermissionInput.schema';
import { RoleScalarWhereInputObjectSchema as RoleScalarWhereInputObjectSchema } from './RoleScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RoleCreateWithoutPermissionInputObjectSchema), z.lazy(() => RoleCreateWithoutPermissionInputObjectSchema).array(), z.lazy(() => RoleUncheckedCreateWithoutPermissionInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutPermissionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoleCreateOrConnectWithoutPermissionInputObjectSchema), z.lazy(() => RoleCreateOrConnectWithoutPermissionInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RoleUpsertWithWhereUniqueWithoutPermissionInputObjectSchema), z.lazy(() => RoleUpsertWithWhereUniqueWithoutPermissionInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RoleUpdateWithWhereUniqueWithoutPermissionInputObjectSchema), z.lazy(() => RoleUpdateWithWhereUniqueWithoutPermissionInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RoleUpdateManyWithWhereWithoutPermissionInputObjectSchema), z.lazy(() => RoleUpdateManyWithWhereWithoutPermissionInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RoleScalarWhereInputObjectSchema), z.lazy(() => RoleScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const RoleUncheckedUpdateManyWithoutPermissionNestedInputObjectSchema: z.ZodType<Prisma.RoleUncheckedUpdateManyWithoutPermissionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedUpdateManyWithoutPermissionNestedInput>;
export const RoleUncheckedUpdateManyWithoutPermissionNestedInputObjectZodSchema = makeSchema();

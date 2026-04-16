import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateWithoutPermissionsInputObjectSchema as RoleCreateWithoutPermissionsInputObjectSchema } from './RoleCreateWithoutPermissionsInput.schema';
import { RoleUncheckedCreateWithoutPermissionsInputObjectSchema as RoleUncheckedCreateWithoutPermissionsInputObjectSchema } from './RoleUncheckedCreateWithoutPermissionsInput.schema';
import { RoleCreateOrConnectWithoutPermissionsInputObjectSchema as RoleCreateOrConnectWithoutPermissionsInputObjectSchema } from './RoleCreateOrConnectWithoutPermissionsInput.schema';
import { RoleUpsertWithWhereUniqueWithoutPermissionsInputObjectSchema as RoleUpsertWithWhereUniqueWithoutPermissionsInputObjectSchema } from './RoleUpsertWithWhereUniqueWithoutPermissionsInput.schema';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithWhereUniqueWithoutPermissionsInputObjectSchema as RoleUpdateWithWhereUniqueWithoutPermissionsInputObjectSchema } from './RoleUpdateWithWhereUniqueWithoutPermissionsInput.schema';
import { RoleUpdateManyWithWhereWithoutPermissionsInputObjectSchema as RoleUpdateManyWithWhereWithoutPermissionsInputObjectSchema } from './RoleUpdateManyWithWhereWithoutPermissionsInput.schema';
import { RoleScalarWhereInputObjectSchema as RoleScalarWhereInputObjectSchema } from './RoleScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RoleCreateWithoutPermissionsInputObjectSchema), z.lazy(() => RoleCreateWithoutPermissionsInputObjectSchema).array(), z.lazy(() => RoleUncheckedCreateWithoutPermissionsInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutPermissionsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoleCreateOrConnectWithoutPermissionsInputObjectSchema), z.lazy(() => RoleCreateOrConnectWithoutPermissionsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RoleUpsertWithWhereUniqueWithoutPermissionsInputObjectSchema), z.lazy(() => RoleUpsertWithWhereUniqueWithoutPermissionsInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RoleUpdateWithWhereUniqueWithoutPermissionsInputObjectSchema), z.lazy(() => RoleUpdateWithWhereUniqueWithoutPermissionsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RoleUpdateManyWithWhereWithoutPermissionsInputObjectSchema), z.lazy(() => RoleUpdateManyWithWhereWithoutPermissionsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RoleScalarWhereInputObjectSchema), z.lazy(() => RoleScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const RoleUncheckedUpdateManyWithoutPermissionsNestedInputObjectSchema: z.ZodType<Prisma.RoleUncheckedUpdateManyWithoutPermissionsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedUpdateManyWithoutPermissionsNestedInput>;
export const RoleUncheckedUpdateManyWithoutPermissionsNestedInputObjectZodSchema = makeSchema();

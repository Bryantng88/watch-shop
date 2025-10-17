import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateWithoutUsersInputObjectSchema as RoleCreateWithoutUsersInputObjectSchema } from './RoleCreateWithoutUsersInput.schema';
import { RoleUncheckedCreateWithoutUsersInputObjectSchema as RoleUncheckedCreateWithoutUsersInputObjectSchema } from './RoleUncheckedCreateWithoutUsersInput.schema';
import { RoleCreateOrConnectWithoutUsersInputObjectSchema as RoleCreateOrConnectWithoutUsersInputObjectSchema } from './RoleCreateOrConnectWithoutUsersInput.schema';
import { RoleUpsertWithWhereUniqueWithoutUsersInputObjectSchema as RoleUpsertWithWhereUniqueWithoutUsersInputObjectSchema } from './RoleUpsertWithWhereUniqueWithoutUsersInput.schema';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithWhereUniqueWithoutUsersInputObjectSchema as RoleUpdateWithWhereUniqueWithoutUsersInputObjectSchema } from './RoleUpdateWithWhereUniqueWithoutUsersInput.schema';
import { RoleUpdateManyWithWhereWithoutUsersInputObjectSchema as RoleUpdateManyWithWhereWithoutUsersInputObjectSchema } from './RoleUpdateManyWithWhereWithoutUsersInput.schema';
import { RoleScalarWhereInputObjectSchema as RoleScalarWhereInputObjectSchema } from './RoleScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RoleCreateWithoutUsersInputObjectSchema), z.lazy(() => RoleCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => RoleUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoleCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => RoleCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RoleUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => RoleUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RoleUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => RoleUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RoleUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => RoleUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RoleScalarWhereInputObjectSchema), z.lazy(() => RoleScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const RoleUpdateManyWithoutUsersNestedInputObjectSchema: z.ZodType<Prisma.RoleUpdateManyWithoutUsersNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateManyWithoutUsersNestedInput>;
export const RoleUpdateManyWithoutUsersNestedInputObjectZodSchema = makeSchema();

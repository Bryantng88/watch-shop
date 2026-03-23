import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutMaintenanceRecordInputObjectSchema as UserCreateWithoutMaintenanceRecordInputObjectSchema } from './UserCreateWithoutMaintenanceRecordInput.schema';
import { UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './UserUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { UserCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as UserCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './UserCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { UserUpsertWithoutMaintenanceRecordInputObjectSchema as UserUpsertWithoutMaintenanceRecordInputObjectSchema } from './UserUpsertWithoutMaintenanceRecordInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema as UserUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema } from './UserUpdateToOneWithWhereWithoutMaintenanceRecordInput.schema';
import { UserUpdateWithoutMaintenanceRecordInputObjectSchema as UserUpdateWithoutMaintenanceRecordInputObjectSchema } from './UserUpdateWithoutMaintenanceRecordInput.schema';
import { UserUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as UserUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './UserUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutMaintenanceRecordInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => UserUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutMaintenanceRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutMaintenanceRecordNestedInput>;
export const UserUpdateOneWithoutMaintenanceRecordNestedInputObjectZodSchema = makeSchema();

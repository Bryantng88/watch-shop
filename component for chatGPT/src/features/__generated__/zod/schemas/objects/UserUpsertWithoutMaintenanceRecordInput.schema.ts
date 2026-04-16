import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutMaintenanceRecordInputObjectSchema as UserUpdateWithoutMaintenanceRecordInputObjectSchema } from './UserUpdateWithoutMaintenanceRecordInput.schema';
import { UserUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as UserUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './UserUncheckedUpdateWithoutMaintenanceRecordInput.schema';
import { UserCreateWithoutMaintenanceRecordInputObjectSchema as UserCreateWithoutMaintenanceRecordInputObjectSchema } from './UserCreateWithoutMaintenanceRecordInput.schema';
import { UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './UserUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutMaintenanceRecordInput>;
export const UserUpsertWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();

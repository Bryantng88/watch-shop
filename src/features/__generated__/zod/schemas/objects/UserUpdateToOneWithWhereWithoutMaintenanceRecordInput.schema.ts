import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutMaintenanceRecordInputObjectSchema as UserUpdateWithoutMaintenanceRecordInputObjectSchema } from './UserUpdateWithoutMaintenanceRecordInput.schema';
import { UserUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as UserUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './UserUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutMaintenanceRecordInput>;
export const UserUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();

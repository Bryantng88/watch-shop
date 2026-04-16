import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutMaintenanceRecordInputObjectSchema as UserCreateWithoutMaintenanceRecordInputObjectSchema } from './UserCreateWithoutMaintenanceRecordInput.schema';
import { UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './UserUncheckedCreateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutMaintenanceRecordInput>;
export const UserCreateOrConnectWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();

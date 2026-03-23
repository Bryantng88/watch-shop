import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutMaintenanceRecordInputObjectSchema as UserCreateWithoutMaintenanceRecordInputObjectSchema } from './UserCreateWithoutMaintenanceRecordInput.schema';
import { UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './UserUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { UserCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as UserCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './UserCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutMaintenanceRecordInput>;
export const UserCreateNestedOneWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();

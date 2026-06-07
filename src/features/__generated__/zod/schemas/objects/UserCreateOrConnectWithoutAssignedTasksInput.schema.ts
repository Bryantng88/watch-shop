import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutAssignedTasksInputObjectSchema as UserCreateWithoutAssignedTasksInputObjectSchema } from './UserCreateWithoutAssignedTasksInput.schema';
import { UserUncheckedCreateWithoutAssignedTasksInputObjectSchema as UserUncheckedCreateWithoutAssignedTasksInputObjectSchema } from './UserUncheckedCreateWithoutAssignedTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutAssignedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedTasksInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutAssignedTasksInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedTasksInput>;
export const UserCreateOrConnectWithoutAssignedTasksInputObjectZodSchema = makeSchema();

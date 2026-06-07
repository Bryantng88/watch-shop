import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutAssignedTasksInputObjectSchema as UserCreateWithoutAssignedTasksInputObjectSchema } from './UserCreateWithoutAssignedTasksInput.schema';
import { UserUncheckedCreateWithoutAssignedTasksInputObjectSchema as UserUncheckedCreateWithoutAssignedTasksInputObjectSchema } from './UserUncheckedCreateWithoutAssignedTasksInput.schema';
import { UserCreateOrConnectWithoutAssignedTasksInputObjectSchema as UserCreateOrConnectWithoutAssignedTasksInputObjectSchema } from './UserCreateOrConnectWithoutAssignedTasksInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAssignedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedTasksInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutAssignedTasksInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedTasksInput>;
export const UserCreateNestedOneWithoutAssignedTasksInputObjectZodSchema = makeSchema();

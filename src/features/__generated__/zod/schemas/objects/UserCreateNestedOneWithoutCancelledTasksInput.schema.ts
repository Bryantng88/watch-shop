import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutCancelledTasksInputObjectSchema as UserCreateWithoutCancelledTasksInputObjectSchema } from './UserCreateWithoutCancelledTasksInput.schema';
import { UserUncheckedCreateWithoutCancelledTasksInputObjectSchema as UserUncheckedCreateWithoutCancelledTasksInputObjectSchema } from './UserUncheckedCreateWithoutCancelledTasksInput.schema';
import { UserCreateOrConnectWithoutCancelledTasksInputObjectSchema as UserCreateOrConnectWithoutCancelledTasksInputObjectSchema } from './UserCreateOrConnectWithoutCancelledTasksInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCancelledTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCancelledTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCancelledTasksInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutCancelledTasksInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCancelledTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutCancelledTasksInput>;
export const UserCreateNestedOneWithoutCancelledTasksInputObjectZodSchema = makeSchema();

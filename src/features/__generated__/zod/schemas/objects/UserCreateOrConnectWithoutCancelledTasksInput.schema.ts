import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutCancelledTasksInputObjectSchema as UserCreateWithoutCancelledTasksInputObjectSchema } from './UserCreateWithoutCancelledTasksInput.schema';
import { UserUncheckedCreateWithoutCancelledTasksInputObjectSchema as UserUncheckedCreateWithoutCancelledTasksInputObjectSchema } from './UserUncheckedCreateWithoutCancelledTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutCancelledTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCancelledTasksInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutCancelledTasksInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCancelledTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutCancelledTasksInput>;
export const UserCreateOrConnectWithoutCancelledTasksInputObjectZodSchema = makeSchema();

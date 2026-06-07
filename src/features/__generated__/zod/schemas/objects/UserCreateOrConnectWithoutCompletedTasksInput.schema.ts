import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutCompletedTasksInputObjectSchema as UserCreateWithoutCompletedTasksInputObjectSchema } from './UserCreateWithoutCompletedTasksInput.schema';
import { UserUncheckedCreateWithoutCompletedTasksInputObjectSchema as UserUncheckedCreateWithoutCompletedTasksInputObjectSchema } from './UserUncheckedCreateWithoutCompletedTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutCompletedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCompletedTasksInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutCompletedTasksInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCompletedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutCompletedTasksInput>;
export const UserCreateOrConnectWithoutCompletedTasksInputObjectZodSchema = makeSchema();

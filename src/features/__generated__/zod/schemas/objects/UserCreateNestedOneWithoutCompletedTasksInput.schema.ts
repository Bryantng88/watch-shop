import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutCompletedTasksInputObjectSchema as UserCreateWithoutCompletedTasksInputObjectSchema } from './UserCreateWithoutCompletedTasksInput.schema';
import { UserUncheckedCreateWithoutCompletedTasksInputObjectSchema as UserUncheckedCreateWithoutCompletedTasksInputObjectSchema } from './UserUncheckedCreateWithoutCompletedTasksInput.schema';
import { UserCreateOrConnectWithoutCompletedTasksInputObjectSchema as UserCreateOrConnectWithoutCompletedTasksInputObjectSchema } from './UserCreateOrConnectWithoutCompletedTasksInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCompletedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCompletedTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCompletedTasksInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutCompletedTasksInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCompletedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutCompletedTasksInput>;
export const UserCreateNestedOneWithoutCompletedTasksInputObjectZodSchema = makeSchema();

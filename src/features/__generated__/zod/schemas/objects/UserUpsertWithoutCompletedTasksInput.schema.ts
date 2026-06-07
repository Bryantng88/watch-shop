import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutCompletedTasksInputObjectSchema as UserUpdateWithoutCompletedTasksInputObjectSchema } from './UserUpdateWithoutCompletedTasksInput.schema';
import { UserUncheckedUpdateWithoutCompletedTasksInputObjectSchema as UserUncheckedUpdateWithoutCompletedTasksInputObjectSchema } from './UserUncheckedUpdateWithoutCompletedTasksInput.schema';
import { UserCreateWithoutCompletedTasksInputObjectSchema as UserCreateWithoutCompletedTasksInputObjectSchema } from './UserCreateWithoutCompletedTasksInput.schema';
import { UserUncheckedCreateWithoutCompletedTasksInputObjectSchema as UserUncheckedCreateWithoutCompletedTasksInputObjectSchema } from './UserUncheckedCreateWithoutCompletedTasksInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutCompletedTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCompletedTasksInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutCompletedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCompletedTasksInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutCompletedTasksInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutCompletedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutCompletedTasksInput>;
export const UserUpsertWithoutCompletedTasksInputObjectZodSchema = makeSchema();

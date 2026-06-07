import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutCancelledTasksInputObjectSchema as UserUpdateWithoutCancelledTasksInputObjectSchema } from './UserUpdateWithoutCancelledTasksInput.schema';
import { UserUncheckedUpdateWithoutCancelledTasksInputObjectSchema as UserUncheckedUpdateWithoutCancelledTasksInputObjectSchema } from './UserUncheckedUpdateWithoutCancelledTasksInput.schema';
import { UserCreateWithoutCancelledTasksInputObjectSchema as UserCreateWithoutCancelledTasksInputObjectSchema } from './UserCreateWithoutCancelledTasksInput.schema';
import { UserUncheckedCreateWithoutCancelledTasksInputObjectSchema as UserUncheckedCreateWithoutCancelledTasksInputObjectSchema } from './UserUncheckedCreateWithoutCancelledTasksInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutCancelledTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCancelledTasksInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutCancelledTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCancelledTasksInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutCancelledTasksInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutCancelledTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutCancelledTasksInput>;
export const UserUpsertWithoutCancelledTasksInputObjectZodSchema = makeSchema();

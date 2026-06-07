import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutAssignedTasksInputObjectSchema as UserUpdateWithoutAssignedTasksInputObjectSchema } from './UserUpdateWithoutAssignedTasksInput.schema';
import { UserUncheckedUpdateWithoutAssignedTasksInputObjectSchema as UserUncheckedUpdateWithoutAssignedTasksInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedTasksInput.schema';
import { UserCreateWithoutAssignedTasksInputObjectSchema as UserCreateWithoutAssignedTasksInputObjectSchema } from './UserCreateWithoutAssignedTasksInput.schema';
import { UserUncheckedCreateWithoutAssignedTasksInputObjectSchema as UserUncheckedCreateWithoutAssignedTasksInputObjectSchema } from './UserUncheckedCreateWithoutAssignedTasksInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutAssignedTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedTasksInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutAssignedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedTasksInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutAssignedTasksInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutAssignedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutAssignedTasksInput>;
export const UserUpsertWithoutAssignedTasksInputObjectZodSchema = makeSchema();

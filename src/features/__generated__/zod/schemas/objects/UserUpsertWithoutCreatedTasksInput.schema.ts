import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutCreatedTasksInputObjectSchema as UserUpdateWithoutCreatedTasksInputObjectSchema } from './UserUpdateWithoutCreatedTasksInput.schema';
import { UserUncheckedUpdateWithoutCreatedTasksInputObjectSchema as UserUncheckedUpdateWithoutCreatedTasksInputObjectSchema } from './UserUncheckedUpdateWithoutCreatedTasksInput.schema';
import { UserCreateWithoutCreatedTasksInputObjectSchema as UserCreateWithoutCreatedTasksInputObjectSchema } from './UserCreateWithoutCreatedTasksInput.schema';
import { UserUncheckedCreateWithoutCreatedTasksInputObjectSchema as UserUncheckedCreateWithoutCreatedTasksInputObjectSchema } from './UserUncheckedCreateWithoutCreatedTasksInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutCreatedTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCreatedTasksInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutCreatedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedTasksInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutCreatedTasksInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutCreatedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutCreatedTasksInput>;
export const UserUpsertWithoutCreatedTasksInputObjectZodSchema = makeSchema();

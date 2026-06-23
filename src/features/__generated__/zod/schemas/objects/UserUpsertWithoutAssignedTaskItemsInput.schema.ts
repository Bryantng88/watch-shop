import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutAssignedTaskItemsInputObjectSchema as UserUpdateWithoutAssignedTaskItemsInputObjectSchema } from './UserUpdateWithoutAssignedTaskItemsInput.schema';
import { UserUncheckedUpdateWithoutAssignedTaskItemsInputObjectSchema as UserUncheckedUpdateWithoutAssignedTaskItemsInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedTaskItemsInput.schema';
import { UserCreateWithoutAssignedTaskItemsInputObjectSchema as UserCreateWithoutAssignedTaskItemsInputObjectSchema } from './UserCreateWithoutAssignedTaskItemsInput.schema';
import { UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema as UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedTaskItemsInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutAssignedTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedTaskItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutAssignedTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutAssignedTaskItemsInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutAssignedTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutAssignedTaskItemsInput>;
export const UserUpsertWithoutAssignedTaskItemsInputObjectZodSchema = makeSchema();

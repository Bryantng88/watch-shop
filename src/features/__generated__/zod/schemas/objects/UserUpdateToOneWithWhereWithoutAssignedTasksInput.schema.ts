import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutAssignedTasksInputObjectSchema as UserUpdateWithoutAssignedTasksInputObjectSchema } from './UserUpdateWithoutAssignedTasksInput.schema';
import { UserUncheckedUpdateWithoutAssignedTasksInputObjectSchema as UserUncheckedUpdateWithoutAssignedTasksInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutAssignedTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedTasksInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutAssignedTasksInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedTasksInput>;
export const UserUpdateToOneWithWhereWithoutAssignedTasksInputObjectZodSchema = makeSchema();

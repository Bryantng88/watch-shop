import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutCompletedTasksInputObjectSchema as UserUpdateWithoutCompletedTasksInputObjectSchema } from './UserUpdateWithoutCompletedTasksInput.schema';
import { UserUncheckedUpdateWithoutCompletedTasksInputObjectSchema as UserUncheckedUpdateWithoutCompletedTasksInputObjectSchema } from './UserUncheckedUpdateWithoutCompletedTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutCompletedTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCompletedTasksInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutCompletedTasksInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCompletedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCompletedTasksInput>;
export const UserUpdateToOneWithWhereWithoutCompletedTasksInputObjectZodSchema = makeSchema();

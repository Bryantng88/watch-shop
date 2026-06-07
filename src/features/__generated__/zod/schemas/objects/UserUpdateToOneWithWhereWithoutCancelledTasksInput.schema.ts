import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutCancelledTasksInputObjectSchema as UserUpdateWithoutCancelledTasksInputObjectSchema } from './UserUpdateWithoutCancelledTasksInput.schema';
import { UserUncheckedUpdateWithoutCancelledTasksInputObjectSchema as UserUncheckedUpdateWithoutCancelledTasksInputObjectSchema } from './UserUncheckedUpdateWithoutCancelledTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutCancelledTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCancelledTasksInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutCancelledTasksInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCancelledTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCancelledTasksInput>;
export const UserUpdateToOneWithWhereWithoutCancelledTasksInputObjectZodSchema = makeSchema();

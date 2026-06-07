import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutCreatedTasksInputObjectSchema as UserUpdateWithoutCreatedTasksInputObjectSchema } from './UserUpdateWithoutCreatedTasksInput.schema';
import { UserUncheckedUpdateWithoutCreatedTasksInputObjectSchema as UserUncheckedUpdateWithoutCreatedTasksInputObjectSchema } from './UserUncheckedUpdateWithoutCreatedTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutCreatedTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCreatedTasksInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutCreatedTasksInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCreatedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCreatedTasksInput>;
export const UserUpdateToOneWithWhereWithoutCreatedTasksInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutAssignedTaskItemsInputObjectSchema as UserUpdateWithoutAssignedTaskItemsInputObjectSchema } from './UserUpdateWithoutAssignedTaskItemsInput.schema';
import { UserUncheckedUpdateWithoutAssignedTaskItemsInputObjectSchema as UserUncheckedUpdateWithoutAssignedTaskItemsInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedTaskItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutAssignedTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedTaskItemsInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutAssignedTaskItemsInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedTaskItemsInput>;
export const UserUpdateToOneWithWhereWithoutAssignedTaskItemsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutTaskItemsInputObjectSchema as UserUpdateWithoutTaskItemsInputObjectSchema } from './UserUpdateWithoutTaskItemsInput.schema';
import { UserUncheckedUpdateWithoutTaskItemsInputObjectSchema as UserUncheckedUpdateWithoutTaskItemsInputObjectSchema } from './UserUncheckedUpdateWithoutTaskItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskItemsInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutTaskItemsInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTaskItemsInput>;
export const UserUpdateToOneWithWhereWithoutTaskItemsInputObjectZodSchema = makeSchema();

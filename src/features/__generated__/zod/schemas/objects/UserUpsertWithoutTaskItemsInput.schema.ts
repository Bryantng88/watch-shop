import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutTaskItemsInputObjectSchema as UserUpdateWithoutTaskItemsInputObjectSchema } from './UserUpdateWithoutTaskItemsInput.schema';
import { UserUncheckedUpdateWithoutTaskItemsInputObjectSchema as UserUncheckedUpdateWithoutTaskItemsInputObjectSchema } from './UserUncheckedUpdateWithoutTaskItemsInput.schema';
import { UserCreateWithoutTaskItemsInputObjectSchema as UserCreateWithoutTaskItemsInputObjectSchema } from './UserCreateWithoutTaskItemsInput.schema';
import { UserUncheckedCreateWithoutTaskItemsInputObjectSchema as UserUncheckedCreateWithoutTaskItemsInputObjectSchema } from './UserUncheckedCreateWithoutTaskItemsInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskItemsInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutTaskItemsInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutTaskItemsInput>;
export const UserUpsertWithoutTaskItemsInputObjectZodSchema = makeSchema();

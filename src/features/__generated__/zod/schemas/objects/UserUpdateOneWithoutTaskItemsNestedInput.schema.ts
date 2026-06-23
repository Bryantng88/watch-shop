import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutTaskItemsInputObjectSchema as UserCreateWithoutTaskItemsInputObjectSchema } from './UserCreateWithoutTaskItemsInput.schema';
import { UserUncheckedCreateWithoutTaskItemsInputObjectSchema as UserUncheckedCreateWithoutTaskItemsInputObjectSchema } from './UserUncheckedCreateWithoutTaskItemsInput.schema';
import { UserCreateOrConnectWithoutTaskItemsInputObjectSchema as UserCreateOrConnectWithoutTaskItemsInputObjectSchema } from './UserCreateOrConnectWithoutTaskItemsInput.schema';
import { UserUpsertWithoutTaskItemsInputObjectSchema as UserUpsertWithoutTaskItemsInputObjectSchema } from './UserUpsertWithoutTaskItemsInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutTaskItemsInputObjectSchema as UserUpdateToOneWithWhereWithoutTaskItemsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutTaskItemsInput.schema';
import { UserUpdateWithoutTaskItemsInputObjectSchema as UserUpdateWithoutTaskItemsInputObjectSchema } from './UserUpdateWithoutTaskItemsInput.schema';
import { UserUncheckedUpdateWithoutTaskItemsInputObjectSchema as UserUncheckedUpdateWithoutTaskItemsInputObjectSchema } from './UserUncheckedUpdateWithoutTaskItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTaskItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTaskItemsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutTaskItemsInputObjectSchema), z.lazy(() => UserUpdateWithoutTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskItemsInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutTaskItemsNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutTaskItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutTaskItemsNestedInput>;
export const UserUpdateOneWithoutTaskItemsNestedInputObjectZodSchema = makeSchema();

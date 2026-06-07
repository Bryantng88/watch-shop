import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutCancelledTasksInputObjectSchema as UserCreateWithoutCancelledTasksInputObjectSchema } from './UserCreateWithoutCancelledTasksInput.schema';
import { UserUncheckedCreateWithoutCancelledTasksInputObjectSchema as UserUncheckedCreateWithoutCancelledTasksInputObjectSchema } from './UserUncheckedCreateWithoutCancelledTasksInput.schema';
import { UserCreateOrConnectWithoutCancelledTasksInputObjectSchema as UserCreateOrConnectWithoutCancelledTasksInputObjectSchema } from './UserCreateOrConnectWithoutCancelledTasksInput.schema';
import { UserUpsertWithoutCancelledTasksInputObjectSchema as UserUpsertWithoutCancelledTasksInputObjectSchema } from './UserUpsertWithoutCancelledTasksInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutCancelledTasksInputObjectSchema as UserUpdateToOneWithWhereWithoutCancelledTasksInputObjectSchema } from './UserUpdateToOneWithWhereWithoutCancelledTasksInput.schema';
import { UserUpdateWithoutCancelledTasksInputObjectSchema as UserUpdateWithoutCancelledTasksInputObjectSchema } from './UserUpdateWithoutCancelledTasksInput.schema';
import { UserUncheckedUpdateWithoutCancelledTasksInputObjectSchema as UserUncheckedUpdateWithoutCancelledTasksInputObjectSchema } from './UserUncheckedUpdateWithoutCancelledTasksInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCancelledTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCancelledTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCancelledTasksInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCancelledTasksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutCancelledTasksInputObjectSchema), z.lazy(() => UserUpdateWithoutCancelledTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCancelledTasksInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutCancelledTasksNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutCancelledTasksNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutCancelledTasksNestedInput>;
export const UserUpdateOneWithoutCancelledTasksNestedInputObjectZodSchema = makeSchema();

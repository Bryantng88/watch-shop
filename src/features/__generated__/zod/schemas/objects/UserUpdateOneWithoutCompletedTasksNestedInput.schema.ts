import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutCompletedTasksInputObjectSchema as UserCreateWithoutCompletedTasksInputObjectSchema } from './UserCreateWithoutCompletedTasksInput.schema';
import { UserUncheckedCreateWithoutCompletedTasksInputObjectSchema as UserUncheckedCreateWithoutCompletedTasksInputObjectSchema } from './UserUncheckedCreateWithoutCompletedTasksInput.schema';
import { UserCreateOrConnectWithoutCompletedTasksInputObjectSchema as UserCreateOrConnectWithoutCompletedTasksInputObjectSchema } from './UserCreateOrConnectWithoutCompletedTasksInput.schema';
import { UserUpsertWithoutCompletedTasksInputObjectSchema as UserUpsertWithoutCompletedTasksInputObjectSchema } from './UserUpsertWithoutCompletedTasksInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutCompletedTasksInputObjectSchema as UserUpdateToOneWithWhereWithoutCompletedTasksInputObjectSchema } from './UserUpdateToOneWithWhereWithoutCompletedTasksInput.schema';
import { UserUpdateWithoutCompletedTasksInputObjectSchema as UserUpdateWithoutCompletedTasksInputObjectSchema } from './UserUpdateWithoutCompletedTasksInput.schema';
import { UserUncheckedUpdateWithoutCompletedTasksInputObjectSchema as UserUncheckedUpdateWithoutCompletedTasksInputObjectSchema } from './UserUncheckedUpdateWithoutCompletedTasksInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCompletedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCompletedTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCompletedTasksInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCompletedTasksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutCompletedTasksInputObjectSchema), z.lazy(() => UserUpdateWithoutCompletedTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCompletedTasksInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutCompletedTasksNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutCompletedTasksNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutCompletedTasksNestedInput>;
export const UserUpdateOneWithoutCompletedTasksNestedInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutCreatedTasksInputObjectSchema as UserCreateWithoutCreatedTasksInputObjectSchema } from './UserCreateWithoutCreatedTasksInput.schema';
import { UserUncheckedCreateWithoutCreatedTasksInputObjectSchema as UserUncheckedCreateWithoutCreatedTasksInputObjectSchema } from './UserUncheckedCreateWithoutCreatedTasksInput.schema';
import { UserCreateOrConnectWithoutCreatedTasksInputObjectSchema as UserCreateOrConnectWithoutCreatedTasksInputObjectSchema } from './UserCreateOrConnectWithoutCreatedTasksInput.schema';
import { UserUpsertWithoutCreatedTasksInputObjectSchema as UserUpsertWithoutCreatedTasksInputObjectSchema } from './UserUpsertWithoutCreatedTasksInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutCreatedTasksInputObjectSchema as UserUpdateToOneWithWhereWithoutCreatedTasksInputObjectSchema } from './UserUpdateToOneWithWhereWithoutCreatedTasksInput.schema';
import { UserUpdateWithoutCreatedTasksInputObjectSchema as UserUpdateWithoutCreatedTasksInputObjectSchema } from './UserUpdateWithoutCreatedTasksInput.schema';
import { UserUncheckedUpdateWithoutCreatedTasksInputObjectSchema as UserUncheckedUpdateWithoutCreatedTasksInputObjectSchema } from './UserUncheckedUpdateWithoutCreatedTasksInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCreatedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatedTasksInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCreatedTasksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutCreatedTasksInputObjectSchema), z.lazy(() => UserUpdateWithoutCreatedTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCreatedTasksInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutCreatedTasksNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutCreatedTasksNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutCreatedTasksNestedInput>;
export const UserUpdateOneWithoutCreatedTasksNestedInputObjectZodSchema = makeSchema();

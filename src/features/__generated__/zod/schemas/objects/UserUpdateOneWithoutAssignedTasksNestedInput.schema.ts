import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutAssignedTasksInputObjectSchema as UserCreateWithoutAssignedTasksInputObjectSchema } from './UserCreateWithoutAssignedTasksInput.schema';
import { UserUncheckedCreateWithoutAssignedTasksInputObjectSchema as UserUncheckedCreateWithoutAssignedTasksInputObjectSchema } from './UserUncheckedCreateWithoutAssignedTasksInput.schema';
import { UserCreateOrConnectWithoutAssignedTasksInputObjectSchema as UserCreateOrConnectWithoutAssignedTasksInputObjectSchema } from './UserCreateOrConnectWithoutAssignedTasksInput.schema';
import { UserUpsertWithoutAssignedTasksInputObjectSchema as UserUpsertWithoutAssignedTasksInputObjectSchema } from './UserUpsertWithoutAssignedTasksInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutAssignedTasksInputObjectSchema as UserUpdateToOneWithWhereWithoutAssignedTasksInputObjectSchema } from './UserUpdateToOneWithWhereWithoutAssignedTasksInput.schema';
import { UserUpdateWithoutAssignedTasksInputObjectSchema as UserUpdateWithoutAssignedTasksInputObjectSchema } from './UserUpdateWithoutAssignedTasksInput.schema';
import { UserUncheckedUpdateWithoutAssignedTasksInputObjectSchema as UserUncheckedUpdateWithoutAssignedTasksInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedTasksInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAssignedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedTasksInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAssignedTasksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutAssignedTasksInputObjectSchema), z.lazy(() => UserUpdateWithoutAssignedTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedTasksInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutAssignedTasksNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutAssignedTasksNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutAssignedTasksNestedInput>;
export const UserUpdateOneWithoutAssignedTasksNestedInputObjectZodSchema = makeSchema();

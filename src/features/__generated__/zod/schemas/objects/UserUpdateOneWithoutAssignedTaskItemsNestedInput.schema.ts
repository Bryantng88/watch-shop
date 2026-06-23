import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutAssignedTaskItemsInputObjectSchema as UserCreateWithoutAssignedTaskItemsInputObjectSchema } from './UserCreateWithoutAssignedTaskItemsInput.schema';
import { UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema as UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedTaskItemsInput.schema';
import { UserCreateOrConnectWithoutAssignedTaskItemsInputObjectSchema as UserCreateOrConnectWithoutAssignedTaskItemsInputObjectSchema } from './UserCreateOrConnectWithoutAssignedTaskItemsInput.schema';
import { UserUpsertWithoutAssignedTaskItemsInputObjectSchema as UserUpsertWithoutAssignedTaskItemsInputObjectSchema } from './UserUpsertWithoutAssignedTaskItemsInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutAssignedTaskItemsInputObjectSchema as UserUpdateToOneWithWhereWithoutAssignedTaskItemsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutAssignedTaskItemsInput.schema';
import { UserUpdateWithoutAssignedTaskItemsInputObjectSchema as UserUpdateWithoutAssignedTaskItemsInputObjectSchema } from './UserUpdateWithoutAssignedTaskItemsInput.schema';
import { UserUncheckedUpdateWithoutAssignedTaskItemsInputObjectSchema as UserUncheckedUpdateWithoutAssignedTaskItemsInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedTaskItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAssignedTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedTaskItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAssignedTaskItemsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutAssignedTaskItemsInputObjectSchema), z.lazy(() => UserUpdateWithoutAssignedTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedTaskItemsInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutAssignedTaskItemsNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutAssignedTaskItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutAssignedTaskItemsNestedInput>;
export const UserUpdateOneWithoutAssignedTaskItemsNestedInputObjectZodSchema = makeSchema();

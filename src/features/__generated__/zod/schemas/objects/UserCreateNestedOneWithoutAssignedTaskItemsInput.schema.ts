import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutAssignedTaskItemsInputObjectSchema as UserCreateWithoutAssignedTaskItemsInputObjectSchema } from './UserCreateWithoutAssignedTaskItemsInput.schema';
import { UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema as UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedTaskItemsInput.schema';
import { UserCreateOrConnectWithoutAssignedTaskItemsInputObjectSchema as UserCreateOrConnectWithoutAssignedTaskItemsInputObjectSchema } from './UserCreateOrConnectWithoutAssignedTaskItemsInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAssignedTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedTaskItemsInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutAssignedTaskItemsInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedTaskItemsInput>;
export const UserCreateNestedOneWithoutAssignedTaskItemsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutAssignedTaskItemsInputObjectSchema as UserCreateWithoutAssignedTaskItemsInputObjectSchema } from './UserCreateWithoutAssignedTaskItemsInput.schema';
import { UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema as UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedTaskItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutAssignedTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedTaskItemsInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutAssignedTaskItemsInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedTaskItemsInput>;
export const UserCreateOrConnectWithoutAssignedTaskItemsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutCreatedTasksInputObjectSchema as UserCreateWithoutCreatedTasksInputObjectSchema } from './UserCreateWithoutCreatedTasksInput.schema';
import { UserUncheckedCreateWithoutCreatedTasksInputObjectSchema as UserUncheckedCreateWithoutCreatedTasksInputObjectSchema } from './UserUncheckedCreateWithoutCreatedTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutCreatedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedTasksInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutCreatedTasksInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCreatedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutCreatedTasksInput>;
export const UserCreateOrConnectWithoutCreatedTasksInputObjectZodSchema = makeSchema();

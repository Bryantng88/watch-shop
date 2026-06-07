import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutCreatedTasksInputObjectSchema as UserCreateWithoutCreatedTasksInputObjectSchema } from './UserCreateWithoutCreatedTasksInput.schema';
import { UserUncheckedCreateWithoutCreatedTasksInputObjectSchema as UserUncheckedCreateWithoutCreatedTasksInputObjectSchema } from './UserUncheckedCreateWithoutCreatedTasksInput.schema';
import { UserCreateOrConnectWithoutCreatedTasksInputObjectSchema as UserCreateOrConnectWithoutCreatedTasksInputObjectSchema } from './UserCreateOrConnectWithoutCreatedTasksInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCreatedTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCreatedTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCreatedTasksInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutCreatedTasksInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCreatedTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutCreatedTasksInput>;
export const UserCreateNestedOneWithoutCreatedTasksInputObjectZodSchema = makeSchema();

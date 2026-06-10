import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutTaskExecutionInputObjectSchema as UserCreateWithoutTaskExecutionInputObjectSchema } from './UserCreateWithoutTaskExecutionInput.schema';
import { UserUncheckedCreateWithoutTaskExecutionInputObjectSchema as UserUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './UserUncheckedCreateWithoutTaskExecutionInput.schema';
import { UserCreateOrConnectWithoutTaskExecutionInputObjectSchema as UserCreateOrConnectWithoutTaskExecutionInputObjectSchema } from './UserCreateOrConnectWithoutTaskExecutionInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskExecutionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTaskExecutionInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutTaskExecutionInput>;
export const UserCreateNestedOneWithoutTaskExecutionInputObjectZodSchema = makeSchema();

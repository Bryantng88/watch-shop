import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutTaskExecutionInputObjectSchema as UserCreateWithoutTaskExecutionInputObjectSchema } from './UserCreateWithoutTaskExecutionInput.schema';
import { UserUncheckedCreateWithoutTaskExecutionInputObjectSchema as UserUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './UserUncheckedCreateWithoutTaskExecutionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskExecutionInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutTaskExecutionInput>;
export const UserCreateOrConnectWithoutTaskExecutionInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutTaskExecutionInputObjectSchema as UserUpdateWithoutTaskExecutionInputObjectSchema } from './UserUpdateWithoutTaskExecutionInput.schema';
import { UserUncheckedUpdateWithoutTaskExecutionInputObjectSchema as UserUncheckedUpdateWithoutTaskExecutionInputObjectSchema } from './UserUncheckedUpdateWithoutTaskExecutionInput.schema';
import { UserCreateWithoutTaskExecutionInputObjectSchema as UserCreateWithoutTaskExecutionInputObjectSchema } from './UserCreateWithoutTaskExecutionInput.schema';
import { UserUncheckedCreateWithoutTaskExecutionInputObjectSchema as UserUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './UserUncheckedCreateWithoutTaskExecutionInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutTaskExecutionInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskExecutionInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskExecutionInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutTaskExecutionInput>;
export const UserUpsertWithoutTaskExecutionInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutTaskExecutionInputObjectSchema as UserCreateWithoutTaskExecutionInputObjectSchema } from './UserCreateWithoutTaskExecutionInput.schema';
import { UserUncheckedCreateWithoutTaskExecutionInputObjectSchema as UserUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './UserUncheckedCreateWithoutTaskExecutionInput.schema';
import { UserCreateOrConnectWithoutTaskExecutionInputObjectSchema as UserCreateOrConnectWithoutTaskExecutionInputObjectSchema } from './UserCreateOrConnectWithoutTaskExecutionInput.schema';
import { UserUpsertWithoutTaskExecutionInputObjectSchema as UserUpsertWithoutTaskExecutionInputObjectSchema } from './UserUpsertWithoutTaskExecutionInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema as UserUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema } from './UserUpdateToOneWithWhereWithoutTaskExecutionInput.schema';
import { UserUpdateWithoutTaskExecutionInputObjectSchema as UserUpdateWithoutTaskExecutionInputObjectSchema } from './UserUpdateWithoutTaskExecutionInput.schema';
import { UserUncheckedUpdateWithoutTaskExecutionInputObjectSchema as UserUncheckedUpdateWithoutTaskExecutionInputObjectSchema } from './UserUncheckedUpdateWithoutTaskExecutionInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskExecutionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTaskExecutionInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTaskExecutionInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema), z.lazy(() => UserUpdateWithoutTaskExecutionInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskExecutionInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutTaskExecutionNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutTaskExecutionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutTaskExecutionNestedInput>;
export const UserUpdateOneWithoutTaskExecutionNestedInputObjectZodSchema = makeSchema();

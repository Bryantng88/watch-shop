import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutTaskItemsInputObjectSchema as UserCreateWithoutTaskItemsInputObjectSchema } from './UserCreateWithoutTaskItemsInput.schema';
import { UserUncheckedCreateWithoutTaskItemsInputObjectSchema as UserUncheckedCreateWithoutTaskItemsInputObjectSchema } from './UserUncheckedCreateWithoutTaskItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskItemsInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutTaskItemsInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutTaskItemsInput>;
export const UserCreateOrConnectWithoutTaskItemsInputObjectZodSchema = makeSchema();

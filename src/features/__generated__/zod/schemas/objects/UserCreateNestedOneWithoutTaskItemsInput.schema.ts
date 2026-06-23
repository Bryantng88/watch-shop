import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutTaskItemsInputObjectSchema as UserCreateWithoutTaskItemsInputObjectSchema } from './UserCreateWithoutTaskItemsInput.schema';
import { UserUncheckedCreateWithoutTaskItemsInputObjectSchema as UserUncheckedCreateWithoutTaskItemsInputObjectSchema } from './UserUncheckedCreateWithoutTaskItemsInput.schema';
import { UserCreateOrConnectWithoutTaskItemsInputObjectSchema as UserCreateOrConnectWithoutTaskItemsInputObjectSchema } from './UserCreateOrConnectWithoutTaskItemsInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTaskItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTaskItemsInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutTaskItemsInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutTaskItemsInput>;
export const UserCreateNestedOneWithoutTaskItemsInputObjectZodSchema = makeSchema();

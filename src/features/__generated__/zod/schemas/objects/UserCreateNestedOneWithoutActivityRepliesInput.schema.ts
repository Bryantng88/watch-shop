import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutActivityRepliesInputObjectSchema as UserCreateWithoutActivityRepliesInputObjectSchema } from './UserCreateWithoutActivityRepliesInput.schema';
import { UserUncheckedCreateWithoutActivityRepliesInputObjectSchema as UserUncheckedCreateWithoutActivityRepliesInputObjectSchema } from './UserUncheckedCreateWithoutActivityRepliesInput.schema';
import { UserCreateOrConnectWithoutActivityRepliesInputObjectSchema as UserCreateOrConnectWithoutActivityRepliesInputObjectSchema } from './UserCreateOrConnectWithoutActivityRepliesInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutActivityRepliesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutActivityRepliesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutActivityRepliesInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutActivityRepliesInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutActivityRepliesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutActivityRepliesInput>;
export const UserCreateNestedOneWithoutActivityRepliesInputObjectZodSchema = makeSchema();

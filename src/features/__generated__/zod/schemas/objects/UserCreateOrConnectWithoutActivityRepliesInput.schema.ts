import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutActivityRepliesInputObjectSchema as UserCreateWithoutActivityRepliesInputObjectSchema } from './UserCreateWithoutActivityRepliesInput.schema';
import { UserUncheckedCreateWithoutActivityRepliesInputObjectSchema as UserUncheckedCreateWithoutActivityRepliesInputObjectSchema } from './UserUncheckedCreateWithoutActivityRepliesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutActivityRepliesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutActivityRepliesInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutActivityRepliesInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutActivityRepliesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutActivityRepliesInput>;
export const UserCreateOrConnectWithoutActivityRepliesInputObjectZodSchema = makeSchema();

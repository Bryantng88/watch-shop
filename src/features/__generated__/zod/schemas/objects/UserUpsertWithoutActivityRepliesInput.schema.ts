import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutActivityRepliesInputObjectSchema as UserUpdateWithoutActivityRepliesInputObjectSchema } from './UserUpdateWithoutActivityRepliesInput.schema';
import { UserUncheckedUpdateWithoutActivityRepliesInputObjectSchema as UserUncheckedUpdateWithoutActivityRepliesInputObjectSchema } from './UserUncheckedUpdateWithoutActivityRepliesInput.schema';
import { UserCreateWithoutActivityRepliesInputObjectSchema as UserCreateWithoutActivityRepliesInputObjectSchema } from './UserCreateWithoutActivityRepliesInput.schema';
import { UserUncheckedCreateWithoutActivityRepliesInputObjectSchema as UserUncheckedCreateWithoutActivityRepliesInputObjectSchema } from './UserUncheckedCreateWithoutActivityRepliesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutActivityRepliesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutActivityRepliesInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutActivityRepliesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutActivityRepliesInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutActivityRepliesInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutActivityRepliesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutActivityRepliesInput>;
export const UserUpsertWithoutActivityRepliesInputObjectZodSchema = makeSchema();

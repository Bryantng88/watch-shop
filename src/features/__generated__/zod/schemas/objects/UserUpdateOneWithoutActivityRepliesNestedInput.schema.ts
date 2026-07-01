import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutActivityRepliesInputObjectSchema as UserCreateWithoutActivityRepliesInputObjectSchema } from './UserCreateWithoutActivityRepliesInput.schema';
import { UserUncheckedCreateWithoutActivityRepliesInputObjectSchema as UserUncheckedCreateWithoutActivityRepliesInputObjectSchema } from './UserUncheckedCreateWithoutActivityRepliesInput.schema';
import { UserCreateOrConnectWithoutActivityRepliesInputObjectSchema as UserCreateOrConnectWithoutActivityRepliesInputObjectSchema } from './UserCreateOrConnectWithoutActivityRepliesInput.schema';
import { UserUpsertWithoutActivityRepliesInputObjectSchema as UserUpsertWithoutActivityRepliesInputObjectSchema } from './UserUpsertWithoutActivityRepliesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutActivityRepliesInputObjectSchema as UserUpdateToOneWithWhereWithoutActivityRepliesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutActivityRepliesInput.schema';
import { UserUpdateWithoutActivityRepliesInputObjectSchema as UserUpdateWithoutActivityRepliesInputObjectSchema } from './UserUpdateWithoutActivityRepliesInput.schema';
import { UserUncheckedUpdateWithoutActivityRepliesInputObjectSchema as UserUncheckedUpdateWithoutActivityRepliesInputObjectSchema } from './UserUncheckedUpdateWithoutActivityRepliesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutActivityRepliesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutActivityRepliesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutActivityRepliesInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutActivityRepliesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutActivityRepliesInputObjectSchema), z.lazy(() => UserUpdateWithoutActivityRepliesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutActivityRepliesInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutActivityRepliesNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutActivityRepliesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutActivityRepliesNestedInput>;
export const UserUpdateOneWithoutActivityRepliesNestedInputObjectZodSchema = makeSchema();

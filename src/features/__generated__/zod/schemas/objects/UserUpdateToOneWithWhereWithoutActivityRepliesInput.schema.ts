import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutActivityRepliesInputObjectSchema as UserUpdateWithoutActivityRepliesInputObjectSchema } from './UserUpdateWithoutActivityRepliesInput.schema';
import { UserUncheckedUpdateWithoutActivityRepliesInputObjectSchema as UserUncheckedUpdateWithoutActivityRepliesInputObjectSchema } from './UserUncheckedUpdateWithoutActivityRepliesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutActivityRepliesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutActivityRepliesInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutActivityRepliesInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutActivityRepliesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutActivityRepliesInput>;
export const UserUpdateToOneWithWhereWithoutActivityRepliesInputObjectZodSchema = makeSchema();

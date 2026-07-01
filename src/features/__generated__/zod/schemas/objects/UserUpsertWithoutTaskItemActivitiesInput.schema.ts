import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutTaskItemActivitiesInputObjectSchema as UserUpdateWithoutTaskItemActivitiesInputObjectSchema } from './UserUpdateWithoutTaskItemActivitiesInput.schema';
import { UserUncheckedUpdateWithoutTaskItemActivitiesInputObjectSchema as UserUncheckedUpdateWithoutTaskItemActivitiesInputObjectSchema } from './UserUncheckedUpdateWithoutTaskItemActivitiesInput.schema';
import { UserCreateWithoutTaskItemActivitiesInputObjectSchema as UserCreateWithoutTaskItemActivitiesInputObjectSchema } from './UserCreateWithoutTaskItemActivitiesInput.schema';
import { UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema as UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutTaskItemActivitiesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutTaskItemActivitiesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskItemActivitiesInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutTaskItemActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutTaskItemActivitiesInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutTaskItemActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutTaskItemActivitiesInput>;
export const UserUpsertWithoutTaskItemActivitiesInputObjectZodSchema = makeSchema();

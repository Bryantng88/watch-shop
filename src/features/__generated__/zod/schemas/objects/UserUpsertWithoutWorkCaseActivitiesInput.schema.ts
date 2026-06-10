import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutWorkCaseActivitiesInputObjectSchema as UserUpdateWithoutWorkCaseActivitiesInputObjectSchema } from './UserUpdateWithoutWorkCaseActivitiesInput.schema';
import { UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectSchema as UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectSchema } from './UserUncheckedUpdateWithoutWorkCaseActivitiesInput.schema';
import { UserCreateWithoutWorkCaseActivitiesInputObjectSchema as UserCreateWithoutWorkCaseActivitiesInputObjectSchema } from './UserCreateWithoutWorkCaseActivitiesInput.schema';
import { UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema as UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutWorkCaseActivitiesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutWorkCaseActivitiesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutWorkCaseActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutWorkCaseActivitiesInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutWorkCaseActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutWorkCaseActivitiesInput>;
export const UserUpsertWithoutWorkCaseActivitiesInputObjectZodSchema = makeSchema();

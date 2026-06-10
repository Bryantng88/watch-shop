import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutWorkCaseActivitiesInputObjectSchema as UserUpdateWithoutWorkCaseActivitiesInputObjectSchema } from './UserUpdateWithoutWorkCaseActivitiesInput.schema';
import { UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectSchema as UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectSchema } from './UserUncheckedUpdateWithoutWorkCaseActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutWorkCaseActivitiesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutWorkCaseActivitiesInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutWorkCaseActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutWorkCaseActivitiesInput>;
export const UserUpdateToOneWithWhereWithoutWorkCaseActivitiesInputObjectZodSchema = makeSchema();

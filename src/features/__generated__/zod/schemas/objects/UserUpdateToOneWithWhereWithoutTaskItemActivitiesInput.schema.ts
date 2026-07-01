import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutTaskItemActivitiesInputObjectSchema as UserUpdateWithoutTaskItemActivitiesInputObjectSchema } from './UserUpdateWithoutTaskItemActivitiesInput.schema';
import { UserUncheckedUpdateWithoutTaskItemActivitiesInputObjectSchema as UserUncheckedUpdateWithoutTaskItemActivitiesInputObjectSchema } from './UserUncheckedUpdateWithoutTaskItemActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutTaskItemActivitiesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskItemActivitiesInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutTaskItemActivitiesInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTaskItemActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTaskItemActivitiesInput>;
export const UserUpdateToOneWithWhereWithoutTaskItemActivitiesInputObjectZodSchema = makeSchema();

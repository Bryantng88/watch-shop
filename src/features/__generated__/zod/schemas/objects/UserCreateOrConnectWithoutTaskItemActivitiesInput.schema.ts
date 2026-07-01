import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutTaskItemActivitiesInputObjectSchema as UserCreateWithoutTaskItemActivitiesInputObjectSchema } from './UserCreateWithoutTaskItemActivitiesInput.schema';
import { UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema as UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutTaskItemActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutTaskItemActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutTaskItemActivitiesInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTaskItemActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutTaskItemActivitiesInput>;
export const UserCreateOrConnectWithoutTaskItemActivitiesInputObjectZodSchema = makeSchema();

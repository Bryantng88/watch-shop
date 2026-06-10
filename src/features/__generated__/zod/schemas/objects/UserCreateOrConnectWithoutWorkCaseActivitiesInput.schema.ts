import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutWorkCaseActivitiesInputObjectSchema as UserCreateWithoutWorkCaseActivitiesInputObjectSchema } from './UserCreateWithoutWorkCaseActivitiesInput.schema';
import { UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema as UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutWorkCaseActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutWorkCaseActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutWorkCaseActivitiesInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutWorkCaseActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutWorkCaseActivitiesInput>;
export const UserCreateOrConnectWithoutWorkCaseActivitiesInputObjectZodSchema = makeSchema();

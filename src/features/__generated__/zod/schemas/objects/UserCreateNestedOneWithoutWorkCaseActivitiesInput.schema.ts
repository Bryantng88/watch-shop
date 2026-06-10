import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutWorkCaseActivitiesInputObjectSchema as UserCreateWithoutWorkCaseActivitiesInputObjectSchema } from './UserCreateWithoutWorkCaseActivitiesInput.schema';
import { UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema as UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutWorkCaseActivitiesInput.schema';
import { UserCreateOrConnectWithoutWorkCaseActivitiesInputObjectSchema as UserCreateOrConnectWithoutWorkCaseActivitiesInputObjectSchema } from './UserCreateOrConnectWithoutWorkCaseActivitiesInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutWorkCaseActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutWorkCaseActivitiesInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutWorkCaseActivitiesInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutWorkCaseActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutWorkCaseActivitiesInput>;
export const UserCreateNestedOneWithoutWorkCaseActivitiesInputObjectZodSchema = makeSchema();

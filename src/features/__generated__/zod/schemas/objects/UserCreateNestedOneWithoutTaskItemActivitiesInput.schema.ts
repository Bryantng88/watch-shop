import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutTaskItemActivitiesInputObjectSchema as UserCreateWithoutTaskItemActivitiesInputObjectSchema } from './UserCreateWithoutTaskItemActivitiesInput.schema';
import { UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema as UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutTaskItemActivitiesInput.schema';
import { UserCreateOrConnectWithoutTaskItemActivitiesInputObjectSchema as UserCreateOrConnectWithoutTaskItemActivitiesInputObjectSchema } from './UserCreateOrConnectWithoutTaskItemActivitiesInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTaskItemActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTaskItemActivitiesInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutTaskItemActivitiesInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTaskItemActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutTaskItemActivitiesInput>;
export const UserCreateNestedOneWithoutTaskItemActivitiesInputObjectZodSchema = makeSchema();

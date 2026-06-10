import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutWorkCaseActivitiesInputObjectSchema as UserCreateWithoutWorkCaseActivitiesInputObjectSchema } from './UserCreateWithoutWorkCaseActivitiesInput.schema';
import { UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema as UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutWorkCaseActivitiesInput.schema';
import { UserCreateOrConnectWithoutWorkCaseActivitiesInputObjectSchema as UserCreateOrConnectWithoutWorkCaseActivitiesInputObjectSchema } from './UserCreateOrConnectWithoutWorkCaseActivitiesInput.schema';
import { UserUpsertWithoutWorkCaseActivitiesInputObjectSchema as UserUpsertWithoutWorkCaseActivitiesInputObjectSchema } from './UserUpsertWithoutWorkCaseActivitiesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutWorkCaseActivitiesInputObjectSchema as UserUpdateToOneWithWhereWithoutWorkCaseActivitiesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutWorkCaseActivitiesInput.schema';
import { UserUpdateWithoutWorkCaseActivitiesInputObjectSchema as UserUpdateWithoutWorkCaseActivitiesInputObjectSchema } from './UserUpdateWithoutWorkCaseActivitiesInput.schema';
import { UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectSchema as UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectSchema } from './UserUncheckedUpdateWithoutWorkCaseActivitiesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutWorkCaseActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutWorkCaseActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutWorkCaseActivitiesInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutWorkCaseActivitiesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutWorkCaseActivitiesInputObjectSchema), z.lazy(() => UserUpdateWithoutWorkCaseActivitiesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutWorkCaseActivitiesNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutWorkCaseActivitiesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutWorkCaseActivitiesNestedInput>;
export const UserUpdateOneWithoutWorkCaseActivitiesNestedInputObjectZodSchema = makeSchema();

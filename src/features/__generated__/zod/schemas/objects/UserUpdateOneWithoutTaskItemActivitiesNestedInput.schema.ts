import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutTaskItemActivitiesInputObjectSchema as UserCreateWithoutTaskItemActivitiesInputObjectSchema } from './UserCreateWithoutTaskItemActivitiesInput.schema';
import { UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema as UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutTaskItemActivitiesInput.schema';
import { UserCreateOrConnectWithoutTaskItemActivitiesInputObjectSchema as UserCreateOrConnectWithoutTaskItemActivitiesInputObjectSchema } from './UserCreateOrConnectWithoutTaskItemActivitiesInput.schema';
import { UserUpsertWithoutTaskItemActivitiesInputObjectSchema as UserUpsertWithoutTaskItemActivitiesInputObjectSchema } from './UserUpsertWithoutTaskItemActivitiesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutTaskItemActivitiesInputObjectSchema as UserUpdateToOneWithWhereWithoutTaskItemActivitiesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutTaskItemActivitiesInput.schema';
import { UserUpdateWithoutTaskItemActivitiesInputObjectSchema as UserUpdateWithoutTaskItemActivitiesInputObjectSchema } from './UserUpdateWithoutTaskItemActivitiesInput.schema';
import { UserUncheckedUpdateWithoutTaskItemActivitiesInputObjectSchema as UserUncheckedUpdateWithoutTaskItemActivitiesInputObjectSchema } from './UserUncheckedUpdateWithoutTaskItemActivitiesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTaskItemActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskItemActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTaskItemActivitiesInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTaskItemActivitiesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutTaskItemActivitiesInputObjectSchema), z.lazy(() => UserUpdateWithoutTaskItemActivitiesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskItemActivitiesInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutTaskItemActivitiesNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutTaskItemActivitiesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutTaskItemActivitiesNestedInput>;
export const UserUpdateOneWithoutTaskItemActivitiesNestedInputObjectZodSchema = makeSchema();

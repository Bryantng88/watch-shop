import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema as UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserCreateWithoutPurchaseRequestActivitiesInput.schema';
import { UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema as UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutPurchaseRequestActivitiesInput.schema';
import { UserCreateOrConnectWithoutPurchaseRequestActivitiesInputObjectSchema as UserCreateOrConnectWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserCreateOrConnectWithoutPurchaseRequestActivitiesInput.schema';
import { UserUpsertWithoutPurchaseRequestActivitiesInputObjectSchema as UserUpsertWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUpsertWithoutPurchaseRequestActivitiesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutPurchaseRequestActivitiesInputObjectSchema as UserUpdateToOneWithWhereWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutPurchaseRequestActivitiesInput.schema';
import { UserUpdateWithoutPurchaseRequestActivitiesInputObjectSchema as UserUpdateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUpdateWithoutPurchaseRequestActivitiesInput.schema';
import { UserUncheckedUpdateWithoutPurchaseRequestActivitiesInputObjectSchema as UserUncheckedUpdateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUncheckedUpdateWithoutPurchaseRequestActivitiesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPurchaseRequestActivitiesInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPurchaseRequestActivitiesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutPurchaseRequestActivitiesInputObjectSchema), z.lazy(() => UserUpdateWithoutPurchaseRequestActivitiesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutPurchaseRequestActivitiesInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutPurchaseRequestActivitiesNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutPurchaseRequestActivitiesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutPurchaseRequestActivitiesNestedInput>;
export const UserUpdateOneWithoutPurchaseRequestActivitiesNestedInputObjectZodSchema = makeSchema();

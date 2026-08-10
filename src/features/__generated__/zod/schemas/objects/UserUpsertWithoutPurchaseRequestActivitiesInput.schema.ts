import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutPurchaseRequestActivitiesInputObjectSchema as UserUpdateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUpdateWithoutPurchaseRequestActivitiesInput.schema';
import { UserUncheckedUpdateWithoutPurchaseRequestActivitiesInputObjectSchema as UserUncheckedUpdateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUncheckedUpdateWithoutPurchaseRequestActivitiesInput.schema';
import { UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema as UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserCreateWithoutPurchaseRequestActivitiesInput.schema';
import { UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema as UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutPurchaseRequestActivitiesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutPurchaseRequestActivitiesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutPurchaseRequestActivitiesInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutPurchaseRequestActivitiesInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutPurchaseRequestActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutPurchaseRequestActivitiesInput>;
export const UserUpsertWithoutPurchaseRequestActivitiesInputObjectZodSchema = makeSchema();

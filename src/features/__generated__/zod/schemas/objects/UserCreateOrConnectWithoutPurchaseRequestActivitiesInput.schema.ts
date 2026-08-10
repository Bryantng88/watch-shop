import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema as UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserCreateWithoutPurchaseRequestActivitiesInput.schema';
import { UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema as UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutPurchaseRequestActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutPurchaseRequestActivitiesInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPurchaseRequestActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutPurchaseRequestActivitiesInput>;
export const UserCreateOrConnectWithoutPurchaseRequestActivitiesInputObjectZodSchema = makeSchema();

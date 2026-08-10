import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema as UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserCreateWithoutPurchaseRequestActivitiesInput.schema';
import { UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema as UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUncheckedCreateWithoutPurchaseRequestActivitiesInput.schema';
import { UserCreateOrConnectWithoutPurchaseRequestActivitiesInputObjectSchema as UserCreateOrConnectWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserCreateOrConnectWithoutPurchaseRequestActivitiesInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutPurchaseRequestActivitiesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutPurchaseRequestActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPurchaseRequestActivitiesInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutPurchaseRequestActivitiesInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPurchaseRequestActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutPurchaseRequestActivitiesInput>;
export const UserCreateNestedOneWithoutPurchaseRequestActivitiesInputObjectZodSchema = makeSchema();

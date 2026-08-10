import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutPurchaseRequestActivitiesInputObjectSchema as UserUpdateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUpdateWithoutPurchaseRequestActivitiesInput.schema';
import { UserUncheckedUpdateWithoutPurchaseRequestActivitiesInputObjectSchema as UserUncheckedUpdateWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserUncheckedUpdateWithoutPurchaseRequestActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutPurchaseRequestActivitiesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutPurchaseRequestActivitiesInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutPurchaseRequestActivitiesInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPurchaseRequestActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPurchaseRequestActivitiesInput>;
export const UserUpdateToOneWithWhereWithoutPurchaseRequestActivitiesInputObjectZodSchema = makeSchema();

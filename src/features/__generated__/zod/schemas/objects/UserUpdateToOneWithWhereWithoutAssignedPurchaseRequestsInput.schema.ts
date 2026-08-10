import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutAssignedPurchaseRequestsInputObjectSchema as UserUpdateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUpdateWithoutAssignedPurchaseRequestsInput.schema';
import { UserUncheckedUpdateWithoutAssignedPurchaseRequestsInputObjectSchema as UserUncheckedUpdateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedPurchaseRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutAssignedPurchaseRequestsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedPurchaseRequestsInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutAssignedPurchaseRequestsInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedPurchaseRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedPurchaseRequestsInput>;
export const UserUpdateToOneWithWhereWithoutAssignedPurchaseRequestsInputObjectZodSchema = makeSchema();

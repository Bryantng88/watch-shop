import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutAssignedPurchaseRequestsInputObjectSchema as UserUpdateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUpdateWithoutAssignedPurchaseRequestsInput.schema';
import { UserUncheckedUpdateWithoutAssignedPurchaseRequestsInputObjectSchema as UserUncheckedUpdateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedPurchaseRequestsInput.schema';
import { UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema as UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserCreateWithoutAssignedPurchaseRequestsInput.schema';
import { UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema as UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedPurchaseRequestsInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutAssignedPurchaseRequestsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedPurchaseRequestsInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutAssignedPurchaseRequestsInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutAssignedPurchaseRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutAssignedPurchaseRequestsInput>;
export const UserUpsertWithoutAssignedPurchaseRequestsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema as UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserCreateWithoutAssignedPurchaseRequestsInput.schema';
import { UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema as UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedPurchaseRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutAssignedPurchaseRequestsInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedPurchaseRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedPurchaseRequestsInput>;
export const UserCreateOrConnectWithoutAssignedPurchaseRequestsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema as UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserCreateWithoutAssignedPurchaseRequestsInput.schema';
import { UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema as UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedPurchaseRequestsInput.schema';
import { UserCreateOrConnectWithoutAssignedPurchaseRequestsInputObjectSchema as UserCreateOrConnectWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserCreateOrConnectWithoutAssignedPurchaseRequestsInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedPurchaseRequestsInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutAssignedPurchaseRequestsInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedPurchaseRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedPurchaseRequestsInput>;
export const UserCreateNestedOneWithoutAssignedPurchaseRequestsInputObjectZodSchema = makeSchema();

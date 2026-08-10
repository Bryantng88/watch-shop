import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema as UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserCreateWithoutAssignedPurchaseRequestsInput.schema';
import { UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema as UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedPurchaseRequestsInput.schema';
import { UserCreateOrConnectWithoutAssignedPurchaseRequestsInputObjectSchema as UserCreateOrConnectWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserCreateOrConnectWithoutAssignedPurchaseRequestsInput.schema';
import { UserUpsertWithoutAssignedPurchaseRequestsInputObjectSchema as UserUpsertWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUpsertWithoutAssignedPurchaseRequestsInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutAssignedPurchaseRequestsInputObjectSchema as UserUpdateToOneWithWhereWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutAssignedPurchaseRequestsInput.schema';
import { UserUpdateWithoutAssignedPurchaseRequestsInputObjectSchema as UserUpdateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUpdateWithoutAssignedPurchaseRequestsInput.schema';
import { UserUncheckedUpdateWithoutAssignedPurchaseRequestsInputObjectSchema as UserUncheckedUpdateWithoutAssignedPurchaseRequestsInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedPurchaseRequestsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAssignedPurchaseRequestsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedPurchaseRequestsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedPurchaseRequestsInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAssignedPurchaseRequestsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutAssignedPurchaseRequestsInputObjectSchema), z.lazy(() => UserUpdateWithoutAssignedPurchaseRequestsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedPurchaseRequestsInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutAssignedPurchaseRequestsNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutAssignedPurchaseRequestsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutAssignedPurchaseRequestsNestedInput>;
export const UserUpdateOneWithoutAssignedPurchaseRequestsNestedInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutAssignedChecklistItemsInputObjectSchema as UserCreateWithoutAssignedChecklistItemsInputObjectSchema } from './UserCreateWithoutAssignedChecklistItemsInput.schema';
import { UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema as UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedChecklistItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutAssignedChecklistItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutAssignedChecklistItemsInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedChecklistItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedChecklistItemsInput>;
export const UserCreateOrConnectWithoutAssignedChecklistItemsInputObjectZodSchema = makeSchema();

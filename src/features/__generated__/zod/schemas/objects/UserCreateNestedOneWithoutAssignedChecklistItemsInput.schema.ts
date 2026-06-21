import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutAssignedChecklistItemsInputObjectSchema as UserCreateWithoutAssignedChecklistItemsInputObjectSchema } from './UserCreateWithoutAssignedChecklistItemsInput.schema';
import { UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema as UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedChecklistItemsInput.schema';
import { UserCreateOrConnectWithoutAssignedChecklistItemsInputObjectSchema as UserCreateOrConnectWithoutAssignedChecklistItemsInputObjectSchema } from './UserCreateOrConnectWithoutAssignedChecklistItemsInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAssignedChecklistItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedChecklistItemsInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutAssignedChecklistItemsInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedChecklistItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedChecklistItemsInput>;
export const UserCreateNestedOneWithoutAssignedChecklistItemsInputObjectZodSchema = makeSchema();

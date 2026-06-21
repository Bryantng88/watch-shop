import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutAssignedChecklistItemsInputObjectSchema as UserUpdateWithoutAssignedChecklistItemsInputObjectSchema } from './UserUpdateWithoutAssignedChecklistItemsInput.schema';
import { UserUncheckedUpdateWithoutAssignedChecklistItemsInputObjectSchema as UserUncheckedUpdateWithoutAssignedChecklistItemsInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedChecklistItemsInput.schema';
import { UserCreateWithoutAssignedChecklistItemsInputObjectSchema as UserCreateWithoutAssignedChecklistItemsInputObjectSchema } from './UserCreateWithoutAssignedChecklistItemsInput.schema';
import { UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema as UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedChecklistItemsInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutAssignedChecklistItemsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedChecklistItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutAssignedChecklistItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutAssignedChecklistItemsInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutAssignedChecklistItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutAssignedChecklistItemsInput>;
export const UserUpsertWithoutAssignedChecklistItemsInputObjectZodSchema = makeSchema();

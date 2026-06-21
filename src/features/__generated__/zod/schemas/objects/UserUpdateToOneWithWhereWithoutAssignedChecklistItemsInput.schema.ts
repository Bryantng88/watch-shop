import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutAssignedChecklistItemsInputObjectSchema as UserUpdateWithoutAssignedChecklistItemsInputObjectSchema } from './UserUpdateWithoutAssignedChecklistItemsInput.schema';
import { UserUncheckedUpdateWithoutAssignedChecklistItemsInputObjectSchema as UserUncheckedUpdateWithoutAssignedChecklistItemsInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedChecklistItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutAssignedChecklistItemsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedChecklistItemsInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutAssignedChecklistItemsInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedChecklistItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedChecklistItemsInput>;
export const UserUpdateToOneWithWhereWithoutAssignedChecklistItemsInputObjectZodSchema = makeSchema();

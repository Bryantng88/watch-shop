import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutAssignedChecklistItemsInputObjectSchema as UserCreateWithoutAssignedChecklistItemsInputObjectSchema } from './UserCreateWithoutAssignedChecklistItemsInput.schema';
import { UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema as UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema } from './UserUncheckedCreateWithoutAssignedChecklistItemsInput.schema';
import { UserCreateOrConnectWithoutAssignedChecklistItemsInputObjectSchema as UserCreateOrConnectWithoutAssignedChecklistItemsInputObjectSchema } from './UserCreateOrConnectWithoutAssignedChecklistItemsInput.schema';
import { UserUpsertWithoutAssignedChecklistItemsInputObjectSchema as UserUpsertWithoutAssignedChecklistItemsInputObjectSchema } from './UserUpsertWithoutAssignedChecklistItemsInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutAssignedChecklistItemsInputObjectSchema as UserUpdateToOneWithWhereWithoutAssignedChecklistItemsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutAssignedChecklistItemsInput.schema';
import { UserUpdateWithoutAssignedChecklistItemsInputObjectSchema as UserUpdateWithoutAssignedChecklistItemsInputObjectSchema } from './UserUpdateWithoutAssignedChecklistItemsInput.schema';
import { UserUncheckedUpdateWithoutAssignedChecklistItemsInputObjectSchema as UserUncheckedUpdateWithoutAssignedChecklistItemsInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedChecklistItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAssignedChecklistItemsInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedChecklistItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedChecklistItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAssignedChecklistItemsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutAssignedChecklistItemsInputObjectSchema), z.lazy(() => UserUpdateWithoutAssignedChecklistItemsInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedChecklistItemsInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutAssignedChecklistItemsNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutAssignedChecklistItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutAssignedChecklistItemsNestedInput>;
export const UserUpdateOneWithoutAssignedChecklistItemsNestedInputObjectZodSchema = makeSchema();

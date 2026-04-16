import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { PermissionUncheckedUpdateManyWithoutRoleNestedInputObjectSchema as PermissionUncheckedUpdateManyWithoutRoleNestedInputObjectSchema } from './PermissionUncheckedUpdateManyWithoutRoleNestedInput.schema';
import { UserUncheckedUpdateManyWithoutRoleNestedInputObjectSchema as UserUncheckedUpdateManyWithoutRoleNestedInputObjectSchema } from './UserUncheckedUpdateManyWithoutRoleNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutRoleNestedInputObjectSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutRoleNestedInputObjectSchema).optional()
}).strict();
export const RoleUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.RoleUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedUpdateInput>;
export const RoleUncheckedUpdateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { PermissionUpdateManyWithoutRoleNestedInputObjectSchema as PermissionUpdateManyWithoutRoleNestedInputObjectSchema } from './PermissionUpdateManyWithoutRoleNestedInput.schema';
import { UserUpdateManyWithoutRoleNestedInputObjectSchema as UserUpdateManyWithoutRoleNestedInputObjectSchema } from './UserUpdateManyWithoutRoleNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutRoleNestedInputObjectSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutRoleNestedInputObjectSchema).optional()
}).strict();
export const RoleUpdateInputObjectSchema: z.ZodType<Prisma.RoleUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateInput>;
export const RoleUpdateInputObjectZodSchema = makeSchema();

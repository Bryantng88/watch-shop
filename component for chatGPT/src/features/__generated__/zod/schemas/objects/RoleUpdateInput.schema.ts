import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { PermissionUpdateManyWithoutRolesNestedInputObjectSchema as PermissionUpdateManyWithoutRolesNestedInputObjectSchema } from './PermissionUpdateManyWithoutRolesNestedInput.schema';
import { UserUpdateManyWithoutRolesNestedInputObjectSchema as UserUpdateManyWithoutRolesNestedInputObjectSchema } from './UserUpdateManyWithoutRolesNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  permissions: z.lazy(() => PermissionUpdateManyWithoutRolesNestedInputObjectSchema).optional(),
  users: z.lazy(() => UserUpdateManyWithoutRolesNestedInputObjectSchema).optional()
}).strict();
export const RoleUpdateInputObjectSchema: z.ZodType<Prisma.RoleUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateInput>;
export const RoleUpdateInputObjectZodSchema = makeSchema();

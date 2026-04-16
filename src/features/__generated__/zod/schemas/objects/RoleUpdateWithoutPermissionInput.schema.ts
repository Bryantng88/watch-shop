import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { UserUpdateManyWithoutRolesNestedInputObjectSchema as UserUpdateManyWithoutRolesNestedInputObjectSchema } from './UserUpdateManyWithoutRolesNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  User: z.lazy(() => UserUpdateManyWithoutRolesNestedInputObjectSchema).optional()
}).strict();
export const RoleUpdateWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RoleUpdateWithoutPermissionInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateWithoutPermissionInput>;
export const RoleUpdateWithoutPermissionInputObjectZodSchema = makeSchema();

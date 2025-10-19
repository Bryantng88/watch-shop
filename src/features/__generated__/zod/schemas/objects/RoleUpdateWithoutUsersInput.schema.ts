import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { PermissionUpdateManyWithoutRolesNestedInputObjectSchema as PermissionUpdateManyWithoutRolesNestedInputObjectSchema } from './PermissionUpdateManyWithoutRolesNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  permissions: z.lazy(() => PermissionUpdateManyWithoutRolesNestedInputObjectSchema).optional()
}).strict();
export const RoleUpdateWithoutUsersInputObjectSchema: z.ZodType<Prisma.RoleUpdateWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateWithoutUsersInput>;
export const RoleUpdateWithoutUsersInputObjectZodSchema = makeSchema();

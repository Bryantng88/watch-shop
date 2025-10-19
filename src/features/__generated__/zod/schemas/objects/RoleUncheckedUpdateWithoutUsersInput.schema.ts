import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { PermissionUncheckedUpdateManyWithoutRolesNestedInputObjectSchema as PermissionUncheckedUpdateManyWithoutRolesNestedInputObjectSchema } from './PermissionUncheckedUpdateManyWithoutRolesNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  permissions: z.lazy(() => PermissionUncheckedUpdateManyWithoutRolesNestedInputObjectSchema).optional()
}).strict();
export const RoleUncheckedUpdateWithoutUsersInputObjectSchema: z.ZodType<Prisma.RoleUncheckedUpdateWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedUpdateWithoutUsersInput>;
export const RoleUncheckedUpdateWithoutUsersInputObjectZodSchema = makeSchema();

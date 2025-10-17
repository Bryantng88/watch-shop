import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { UserUncheckedUpdateManyWithoutRolesNestedInputObjectSchema as UserUncheckedUpdateManyWithoutRolesNestedInputObjectSchema } from './UserUncheckedUpdateManyWithoutRolesNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  users: z.lazy(() => UserUncheckedUpdateManyWithoutRolesNestedInputObjectSchema).optional()
}).strict();
export const RoleUncheckedUpdateWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.RoleUncheckedUpdateWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedUpdateWithoutPermissionsInput>;
export const RoleUncheckedUpdateWithoutPermissionsInputObjectZodSchema = makeSchema();

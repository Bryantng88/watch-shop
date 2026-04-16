import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { PermissionUncheckedUpdateManyWithoutRoleNestedInputObjectSchema as PermissionUncheckedUpdateManyWithoutRoleNestedInputObjectSchema } from './PermissionUncheckedUpdateManyWithoutRoleNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutRoleNestedInputObjectSchema).optional()
}).strict();
export const RoleUncheckedUpdateWithoutUserInputObjectSchema: z.ZodType<Prisma.RoleUncheckedUpdateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedUpdateWithoutUserInput>;
export const RoleUncheckedUpdateWithoutUserInputObjectZodSchema = makeSchema();

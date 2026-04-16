import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { RoleUncheckedUpdateManyWithoutPermissionNestedInputObjectSchema as RoleUncheckedUpdateManyWithoutPermissionNestedInputObjectSchema } from './RoleUncheckedUpdateManyWithoutPermissionNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  Role: z.lazy(() => RoleUncheckedUpdateManyWithoutPermissionNestedInputObjectSchema).optional()
}).strict();
export const PermissionUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.PermissionUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUncheckedUpdateInput>;
export const PermissionUncheckedUpdateInputObjectZodSchema = makeSchema();

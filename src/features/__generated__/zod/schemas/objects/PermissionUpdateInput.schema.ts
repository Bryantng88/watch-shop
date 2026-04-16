import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { RoleUpdateManyWithoutPermissionNestedInputObjectSchema as RoleUpdateManyWithoutPermissionNestedInputObjectSchema } from './RoleUpdateManyWithoutPermissionNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  Role: z.lazy(() => RoleUpdateManyWithoutPermissionNestedInputObjectSchema).optional()
}).strict();
export const PermissionUpdateInputObjectSchema: z.ZodType<Prisma.PermissionUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUpdateInput>;
export const PermissionUpdateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { PermissionUpdateManyWithoutRoleNestedInputObjectSchema as PermissionUpdateManyWithoutRoleNestedInputObjectSchema } from './PermissionUpdateManyWithoutRoleNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutRoleNestedInputObjectSchema).optional()
}).strict();
export const RoleUpdateWithoutUserInputObjectSchema: z.ZodType<Prisma.RoleUpdateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateWithoutUserInput>;
export const RoleUpdateWithoutUserInputObjectZodSchema = makeSchema();

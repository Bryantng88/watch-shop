import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { EnumAppTagScopeFieldUpdateOperationsInputObjectSchema as EnumAppTagScopeFieldUpdateOperationsInputObjectSchema } from './EnumAppTagScopeFieldUpdateOperationsInput.schema';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema';
import { NullableEnumAppTagOwnerTypeFieldUpdateOperationsInputObjectSchema as NullableEnumAppTagOwnerTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumAppTagOwnerTypeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  slug: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  scope: z.union([AppTagScopeSchema, z.lazy(() => EnumAppTagScopeFieldUpdateOperationsInputObjectSchema)]).optional(),
  ownerType: z.union([AppTagOwnerTypeSchema, z.lazy(() => NullableEnumAppTagOwnerTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  ownerId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AppTagUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.AppTagUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagUpdateManyMutationInput>;
export const AppTagUpdateManyMutationInputObjectZodSchema = makeSchema();

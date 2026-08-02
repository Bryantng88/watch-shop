import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { StrapInventoryMovementTypeSchema } from '../enums/StrapInventoryMovementType.schema';
import { EnumStrapInventoryMovementTypeFieldUpdateOperationsInputObjectSchema as EnumStrapInventoryMovementTypeFieldUpdateOperationsInputObjectSchema } from './EnumStrapInventoryMovementTypeFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductVariantUpdateOneRequiredWithoutStrapMovementsNestedInputObjectSchema as ProductVariantUpdateOneRequiredWithoutStrapMovementsNestedInputObjectSchema } from './ProductVariantUpdateOneRequiredWithoutStrapMovementsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  movementType: z.union([StrapInventoryMovementTypeSchema, z.lazy(() => EnumStrapInventoryMovementTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  balanceAfter: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  watchId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  orderId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serviceRequestId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  actorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sourceType: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sourceId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  strapVariant: z.lazy(() => ProductVariantUpdateOneRequiredWithoutStrapMovementsNestedInputObjectSchema).optional()
}).strict();
export const StrapInventoryMovementUpdateInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementUpdateInput>;
export const StrapInventoryMovementUpdateInputObjectZodSchema = makeSchema();

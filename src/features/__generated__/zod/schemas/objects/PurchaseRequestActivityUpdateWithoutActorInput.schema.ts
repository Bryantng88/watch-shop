import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema';
import { EnumPurchaseRequestActivityTypeFieldUpdateOperationsInputObjectSchema as EnumPurchaseRequestActivityTypeFieldUpdateOperationsInputObjectSchema } from './EnumPurchaseRequestActivityTypeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { PurchaseRequestUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema as PurchaseRequestUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema } from './PurchaseRequestUpdateOneRequiredWithoutActivitiesNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([PurchaseRequestActivityTypeSchema, z.lazy(() => EnumPurchaseRequestActivityTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  followUpAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema).optional()
}).strict();
export const PurchaseRequestActivityUpdateWithoutActorInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityUpdateWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpdateWithoutActorInput>;
export const PurchaseRequestActivityUpdateWithoutActorInputObjectZodSchema = makeSchema();

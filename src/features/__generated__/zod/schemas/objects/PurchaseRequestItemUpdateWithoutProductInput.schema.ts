import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { PurchaseRequestUpdateOneRequiredWithoutItemsNestedInputObjectSchema as PurchaseRequestUpdateOneRequiredWithoutItemsNestedInputObjectSchema } from './PurchaseRequestUpdateOneRequiredWithoutItemsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  titleSnapshot: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  listPriceSnapshot: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestUpdateOneRequiredWithoutItemsNestedInputObjectSchema).optional()
}).strict();
export const PurchaseRequestItemUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateWithoutProductInput>;
export const PurchaseRequestItemUpdateWithoutProductInputObjectZodSchema = makeSchema();

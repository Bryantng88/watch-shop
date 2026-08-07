import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInputObjectSchema as ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  titleSnapshot: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  listPriceSnapshot: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInputObjectSchema).optional()
}).strict();
export const PurchaseRequestItemUpdateWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateWithoutPurchaseRequestInput>;
export const PurchaseRequestItemUpdateWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { PurchaseRequestItemDecisionSchema } from '../enums/PurchaseRequestItemDecision.schema';
import { EnumPurchaseRequestItemDecisionFieldUpdateOperationsInputObjectSchema as EnumPurchaseRequestItemDecisionFieldUpdateOperationsInputObjectSchema } from './EnumPurchaseRequestItemDecisionFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInputObjectSchema as ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  titleSnapshot: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  listPriceSnapshot: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  decision: z.union([PurchaseRequestItemDecisionSchema, z.lazy(() => EnumPurchaseRequestItemDecisionFieldUpdateOperationsInputObjectSchema)]).optional(),
  agreedPrice: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  decisionReason: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInputObjectSchema).optional()
}).strict();
export const PurchaseRequestItemUpdateWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUpdateWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUpdateWithoutPurchaseRequestInput>;
export const PurchaseRequestItemUpdateWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

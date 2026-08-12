import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema';
import { EnumPurchaseRequestIngressDispositionFieldUpdateOperationsInputObjectSchema as EnumPurchaseRequestIngressDispositionFieldUpdateOperationsInputObjectSchema } from './EnumPurchaseRequestIngressDispositionFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  requestKey: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  requestHash: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  disposition: z.union([PurchaseRequestIngressDispositionSchema, z.lazy(() => EnumPurchaseRequestIngressDispositionFieldUpdateOperationsInputObjectSchema)]).optional(),
  addedItemCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInput>;
export const PurchaseRequestIngressReceiptUpdateWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

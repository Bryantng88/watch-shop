import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  requestKey: z.string(),
  requestHash: z.string(),
  disposition: PurchaseRequestIngressDispositionSchema,
  addedItemCount: z.number().int(),
  createdAt: z.coerce.date().optional()
}).strict();
export const PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInput>;
export const PurchaseRequestIngressReceiptUncheckedCreateWithoutPurchaseRequestInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  requestKey: z.string(),
  requestHash: z.string(),
  purchaseRequestId: z.string(),
  disposition: PurchaseRequestIngressDispositionSchema,
  addedItemCount: z.number().int(),
  createdAt: z.coerce.date().optional()
}).strict();
export const PurchaseRequestIngressReceiptCreateManyInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateManyInput>;
export const PurchaseRequestIngressReceiptCreateManyInputObjectZodSchema = makeSchema();

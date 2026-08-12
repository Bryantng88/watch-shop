import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema';
import { PurchaseRequestCreateNestedOneWithoutIngressReceiptsInputObjectSchema as PurchaseRequestCreateNestedOneWithoutIngressReceiptsInputObjectSchema } from './PurchaseRequestCreateNestedOneWithoutIngressReceiptsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  requestKey: z.string(),
  requestHash: z.string(),
  disposition: PurchaseRequestIngressDispositionSchema,
  addedItemCount: z.number().int(),
  createdAt: z.coerce.date().optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestCreateNestedOneWithoutIngressReceiptsInputObjectSchema)
}).strict();
export const PurchaseRequestIngressReceiptCreateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateInput>;
export const PurchaseRequestIngressReceiptCreateInputObjectZodSchema = makeSchema();

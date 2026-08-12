import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestArgsObjectSchema as PurchaseRequestArgsObjectSchema } from './PurchaseRequestArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  requestKey: z.boolean().optional(),
  requestHash: z.boolean().optional(),
  purchaseRequestId: z.boolean().optional(),
  disposition: z.boolean().optional(),
  addedItemCount: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  purchaseRequest: z.union([z.boolean(), z.lazy(() => PurchaseRequestArgsObjectSchema)]).optional()
}).strict();
export const PurchaseRequestIngressReceiptSelectObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptSelect> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptSelect>;
export const PurchaseRequestIngressReceiptSelectObjectZodSchema = makeSchema();

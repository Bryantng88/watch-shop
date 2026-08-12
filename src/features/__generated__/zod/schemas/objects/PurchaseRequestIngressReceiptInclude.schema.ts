import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestArgsObjectSchema as PurchaseRequestArgsObjectSchema } from './PurchaseRequestArgs.schema'

const makeSchema = () => z.object({
  purchaseRequest: z.union([z.boolean(), z.lazy(() => PurchaseRequestArgsObjectSchema)]).optional()
}).strict();
export const PurchaseRequestIngressReceiptIncludeObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptInclude> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptInclude>;
export const PurchaseRequestIngressReceiptIncludeObjectZodSchema = makeSchema();

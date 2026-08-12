import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressReceiptSelectObjectSchema as PurchaseRequestIngressReceiptSelectObjectSchema } from './PurchaseRequestIngressReceiptSelect.schema';
import { PurchaseRequestIngressReceiptIncludeObjectSchema as PurchaseRequestIngressReceiptIncludeObjectSchema } from './PurchaseRequestIngressReceiptInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PurchaseRequestIngressReceiptSelectObjectSchema).optional(),
  include: z.lazy(() => PurchaseRequestIngressReceiptIncludeObjectSchema).optional()
}).strict();
export const PurchaseRequestIngressReceiptArgsObjectSchema = makeSchema();
export const PurchaseRequestIngressReceiptArgsObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestArgsObjectSchema as PurchaseRequestArgsObjectSchema } from './PurchaseRequestArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  purchaseRequestId: z.boolean().optional(),
  productId: z.boolean().optional(),
  titleSnapshot: z.boolean().optional(),
  listPriceSnapshot: z.boolean().optional(),
  quantity: z.boolean().optional(),
  decision: z.boolean().optional(),
  agreedPrice: z.boolean().optional(),
  decisionReason: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  purchaseRequest: z.union([z.boolean(), z.lazy(() => PurchaseRequestArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const PurchaseRequestItemSelectObjectSchema: z.ZodType<Prisma.PurchaseRequestItemSelect> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemSelect>;
export const PurchaseRequestItemSelectObjectZodSchema = makeSchema();

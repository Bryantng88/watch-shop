import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestArgsObjectSchema as PurchaseRequestArgsObjectSchema } from './PurchaseRequestArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  purchaseRequest: z.union([z.boolean(), z.lazy(() => PurchaseRequestArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const PurchaseRequestItemIncludeObjectSchema: z.ZodType<Prisma.PurchaseRequestItemInclude> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemInclude>;
export const PurchaseRequestItemIncludeObjectZodSchema = makeSchema();

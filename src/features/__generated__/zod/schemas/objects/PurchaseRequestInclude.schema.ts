import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemFindManySchema as PurchaseRequestItemFindManySchema } from '../findManyPurchaseRequestItem.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { PurchaseRequestCountOutputTypeArgsObjectSchema as PurchaseRequestCountOutputTypeArgsObjectSchema } from './PurchaseRequestCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  items: z.union([z.boolean(), z.lazy(() => PurchaseRequestItemFindManySchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PurchaseRequestCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PurchaseRequestIncludeObjectSchema: z.ZodType<Prisma.PurchaseRequestInclude> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestInclude>;
export const PurchaseRequestIncludeObjectZodSchema = makeSchema();

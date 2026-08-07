import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemSelectObjectSchema as PurchaseRequestItemSelectObjectSchema } from './PurchaseRequestItemSelect.schema';
import { PurchaseRequestItemIncludeObjectSchema as PurchaseRequestItemIncludeObjectSchema } from './PurchaseRequestItemInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PurchaseRequestItemSelectObjectSchema).optional(),
  include: z.lazy(() => PurchaseRequestItemIncludeObjectSchema).optional()
}).strict();
export const PurchaseRequestItemArgsObjectSchema = makeSchema();
export const PurchaseRequestItemArgsObjectZodSchema = makeSchema();

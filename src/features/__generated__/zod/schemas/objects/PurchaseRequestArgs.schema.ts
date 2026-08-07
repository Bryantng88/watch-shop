import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestSelectObjectSchema as PurchaseRequestSelectObjectSchema } from './PurchaseRequestSelect.schema';
import { PurchaseRequestIncludeObjectSchema as PurchaseRequestIncludeObjectSchema } from './PurchaseRequestInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PurchaseRequestSelectObjectSchema).optional(),
  include: z.lazy(() => PurchaseRequestIncludeObjectSchema).optional()
}).strict();
export const PurchaseRequestArgsObjectSchema = makeSchema();
export const PurchaseRequestArgsObjectZodSchema = makeSchema();

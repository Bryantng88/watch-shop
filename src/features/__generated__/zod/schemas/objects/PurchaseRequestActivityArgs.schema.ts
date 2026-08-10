import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivitySelectObjectSchema as PurchaseRequestActivitySelectObjectSchema } from './PurchaseRequestActivitySelect.schema';
import { PurchaseRequestActivityIncludeObjectSchema as PurchaseRequestActivityIncludeObjectSchema } from './PurchaseRequestActivityInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PurchaseRequestActivitySelectObjectSchema).optional(),
  include: z.lazy(() => PurchaseRequestActivityIncludeObjectSchema).optional()
}).strict();
export const PurchaseRequestActivityArgsObjectSchema = makeSchema();
export const PurchaseRequestActivityArgsObjectZodSchema = makeSchema();

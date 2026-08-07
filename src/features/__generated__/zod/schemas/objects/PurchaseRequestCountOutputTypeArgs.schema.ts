import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCountOutputTypeSelectObjectSchema as PurchaseRequestCountOutputTypeSelectObjectSchema } from './PurchaseRequestCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PurchaseRequestCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const PurchaseRequestCountOutputTypeArgsObjectSchema = makeSchema();
export const PurchaseRequestCountOutputTypeArgsObjectZodSchema = makeSchema();

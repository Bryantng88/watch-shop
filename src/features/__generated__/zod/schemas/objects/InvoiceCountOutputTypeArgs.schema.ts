import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCountOutputTypeSelectObjectSchema as InvoiceCountOutputTypeSelectObjectSchema } from './InvoiceCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => InvoiceCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const InvoiceCountOutputTypeArgsObjectSchema = makeSchema();
export const InvoiceCountOutputTypeArgsObjectZodSchema = makeSchema();

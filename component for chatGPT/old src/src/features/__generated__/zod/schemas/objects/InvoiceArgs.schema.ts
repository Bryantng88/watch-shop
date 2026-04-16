import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceSelectObjectSchema as InvoiceSelectObjectSchema } from './InvoiceSelect.schema';
import { InvoiceIncludeObjectSchema as InvoiceIncludeObjectSchema } from './InvoiceInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => InvoiceSelectObjectSchema).optional(),
  include: z.lazy(() => InvoiceIncludeObjectSchema).optional()
}).strict();
export const InvoiceArgsObjectSchema = makeSchema();
export const InvoiceArgsObjectZodSchema = makeSchema();

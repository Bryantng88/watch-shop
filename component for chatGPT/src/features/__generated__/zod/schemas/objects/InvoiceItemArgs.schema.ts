import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemSelectObjectSchema as InvoiceItemSelectObjectSchema } from './InvoiceItemSelect.schema';
import { InvoiceItemIncludeObjectSchema as InvoiceItemIncludeObjectSchema } from './InvoiceItemInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => InvoiceItemSelectObjectSchema).optional(),
  include: z.lazy(() => InvoiceItemIncludeObjectSchema).optional()
}).strict();
export const InvoiceItemArgsObjectSchema = makeSchema();
export const InvoiceItemArgsObjectZodSchema = makeSchema();

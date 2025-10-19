import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceArgsObjectSchema as InvoiceArgsObjectSchema } from './InvoiceArgs.schema'

const makeSchema = () => z.object({
  invoice: z.union([z.boolean(), z.lazy(() => InvoiceArgsObjectSchema)]).optional()
}).strict();
export const PaymentIncludeObjectSchema: z.ZodType<Prisma.PaymentInclude> = makeSchema() as unknown as z.ZodType<Prisma.PaymentInclude>;
export const PaymentIncludeObjectZodSchema = makeSchema();

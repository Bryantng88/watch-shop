import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceArgsObjectSchema as InvoiceArgsObjectSchema } from './InvoiceArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  invoiceId: z.boolean().optional(),
  method: z.boolean().optional(),
  amount: z.boolean().optional(),
  currency: z.boolean().optional(),
  paidAt: z.boolean().optional(),
  reference: z.boolean().optional(),
  note: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  invoice: z.union([z.boolean(), z.lazy(() => InvoiceArgsObjectSchema)]).optional()
}).strict();
export const PaymentSelectObjectSchema: z.ZodType<Prisma.PaymentSelect> = makeSchema() as unknown as z.ZodType<Prisma.PaymentSelect>;
export const PaymentSelectObjectZodSchema = makeSchema();

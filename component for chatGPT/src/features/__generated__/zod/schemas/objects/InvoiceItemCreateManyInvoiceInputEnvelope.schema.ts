import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateManyInvoiceInputObjectSchema as InvoiceItemCreateManyInvoiceInputObjectSchema } from './InvoiceItemCreateManyInvoiceInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => InvoiceItemCreateManyInvoiceInputObjectSchema), z.lazy(() => InvoiceItemCreateManyInvoiceInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const InvoiceItemCreateManyInvoiceInputEnvelopeObjectSchema: z.ZodType<Prisma.InvoiceItemCreateManyInvoiceInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateManyInvoiceInputEnvelope>;
export const InvoiceItemCreateManyInvoiceInputEnvelopeObjectZodSchema = makeSchema();

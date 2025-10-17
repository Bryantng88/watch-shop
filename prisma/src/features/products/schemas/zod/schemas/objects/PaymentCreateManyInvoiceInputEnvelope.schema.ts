import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCreateManyInvoiceInputObjectSchema as PaymentCreateManyInvoiceInputObjectSchema } from './PaymentCreateManyInvoiceInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => PaymentCreateManyInvoiceInputObjectSchema), z.lazy(() => PaymentCreateManyInvoiceInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PaymentCreateManyInvoiceInputEnvelopeObjectSchema: z.ZodType<Prisma.PaymentCreateManyInvoiceInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateManyInvoiceInputEnvelope>;
export const PaymentCreateManyInvoiceInputEnvelopeObjectZodSchema = makeSchema();

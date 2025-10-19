import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateManyCustomerInputObjectSchema as InvoiceCreateManyCustomerInputObjectSchema } from './InvoiceCreateManyCustomerInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => InvoiceCreateManyCustomerInputObjectSchema), z.lazy(() => InvoiceCreateManyCustomerInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const InvoiceCreateManyCustomerInputEnvelopeObjectSchema: z.ZodType<Prisma.InvoiceCreateManyCustomerInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateManyCustomerInputEnvelope>;
export const InvoiceCreateManyCustomerInputEnvelopeObjectZodSchema = makeSchema();

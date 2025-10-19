import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateManyVendorInputObjectSchema as InvoiceCreateManyVendorInputObjectSchema } from './InvoiceCreateManyVendorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => InvoiceCreateManyVendorInputObjectSchema), z.lazy(() => InvoiceCreateManyVendorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const InvoiceCreateManyVendorInputEnvelopeObjectSchema: z.ZodType<Prisma.InvoiceCreateManyVendorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateManyVendorInputEnvelope>;
export const InvoiceCreateManyVendorInputEnvelopeObjectZodSchema = makeSchema();

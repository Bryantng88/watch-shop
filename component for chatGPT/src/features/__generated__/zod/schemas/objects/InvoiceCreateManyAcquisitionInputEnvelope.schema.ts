import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateManyAcquisitionInputObjectSchema as InvoiceCreateManyAcquisitionInputObjectSchema } from './InvoiceCreateManyAcquisitionInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => InvoiceCreateManyAcquisitionInputObjectSchema), z.lazy(() => InvoiceCreateManyAcquisitionInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const InvoiceCreateManyAcquisitionInputEnvelopeObjectSchema: z.ZodType<Prisma.InvoiceCreateManyAcquisitionInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateManyAcquisitionInputEnvelope>;
export const InvoiceCreateManyAcquisitionInputEnvelopeObjectZodSchema = makeSchema();

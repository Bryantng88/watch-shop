import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateManyProductInputObjectSchema as InvoiceItemCreateManyProductInputObjectSchema } from './InvoiceItemCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => InvoiceItemCreateManyProductInputObjectSchema), z.lazy(() => InvoiceItemCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const InvoiceItemCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.InvoiceItemCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateManyProductInputEnvelope>;
export const InvoiceItemCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();

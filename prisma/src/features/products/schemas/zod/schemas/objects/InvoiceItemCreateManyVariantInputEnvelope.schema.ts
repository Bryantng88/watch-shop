import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateManyVariantInputObjectSchema as InvoiceItemCreateManyVariantInputObjectSchema } from './InvoiceItemCreateManyVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => InvoiceItemCreateManyVariantInputObjectSchema), z.lazy(() => InvoiceItemCreateManyVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const InvoiceItemCreateManyVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.InvoiceItemCreateManyVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateManyVariantInputEnvelope>;
export const InvoiceItemCreateManyVariantInputEnvelopeObjectZodSchema = makeSchema();

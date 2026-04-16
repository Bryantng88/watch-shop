import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateManyProductVariantInputObjectSchema as InvoiceItemCreateManyProductVariantInputObjectSchema } from './InvoiceItemCreateManyProductVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => InvoiceItemCreateManyProductVariantInputObjectSchema), z.lazy(() => InvoiceItemCreateManyProductVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const InvoiceItemCreateManyProductVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.InvoiceItemCreateManyProductVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateManyProductVariantInputEnvelope>;
export const InvoiceItemCreateManyProductVariantInputEnvelopeObjectZodSchema = makeSchema();

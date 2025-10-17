import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateManyOrderInputObjectSchema as InvoiceCreateManyOrderInputObjectSchema } from './InvoiceCreateManyOrderInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => InvoiceCreateManyOrderInputObjectSchema), z.lazy(() => InvoiceCreateManyOrderInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const InvoiceCreateManyOrderInputEnvelopeObjectSchema: z.ZodType<Prisma.InvoiceCreateManyOrderInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateManyOrderInputEnvelope>;
export const InvoiceCreateManyOrderInputEnvelopeObjectZodSchema = makeSchema();

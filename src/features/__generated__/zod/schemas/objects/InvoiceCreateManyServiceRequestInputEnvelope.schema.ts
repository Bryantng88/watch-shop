import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateManyServiceRequestInputObjectSchema as InvoiceCreateManyServiceRequestInputObjectSchema } from './InvoiceCreateManyServiceRequestInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => InvoiceCreateManyServiceRequestInputObjectSchema), z.lazy(() => InvoiceCreateManyServiceRequestInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const InvoiceCreateManyServiceRequestInputEnvelopeObjectSchema: z.ZodType<Prisma.InvoiceCreateManyServiceRequestInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateManyServiceRequestInputEnvelope>;
export const InvoiceCreateManyServiceRequestInputEnvelopeObjectZodSchema = makeSchema();

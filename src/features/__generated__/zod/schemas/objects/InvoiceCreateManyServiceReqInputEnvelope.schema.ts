import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateManyServiceReqInputObjectSchema as InvoiceCreateManyServiceReqInputObjectSchema } from './InvoiceCreateManyServiceReqInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => InvoiceCreateManyServiceReqInputObjectSchema), z.lazy(() => InvoiceCreateManyServiceReqInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const InvoiceCreateManyServiceReqInputEnvelopeObjectSchema: z.ZodType<Prisma.InvoiceCreateManyServiceReqInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateManyServiceReqInputEnvelope>;
export const InvoiceCreateManyServiceReqInputEnvelopeObjectZodSchema = makeSchema();

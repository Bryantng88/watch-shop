import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemCreateManyProductInputObjectSchema as PurchaseRequestItemCreateManyProductInputObjectSchema } from './PurchaseRequestItemCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => PurchaseRequestItemCreateManyProductInputObjectSchema), z.lazy(() => PurchaseRequestItemCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PurchaseRequestItemCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateManyProductInputEnvelope>;
export const PurchaseRequestItemCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();

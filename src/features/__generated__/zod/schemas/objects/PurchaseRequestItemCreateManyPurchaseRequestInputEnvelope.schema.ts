import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemCreateManyPurchaseRequestInputObjectSchema as PurchaseRequestItemCreateManyPurchaseRequestInputObjectSchema } from './PurchaseRequestItemCreateManyPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => PurchaseRequestItemCreateManyPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestItemCreateManyPurchaseRequestInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PurchaseRequestItemCreateManyPurchaseRequestInputEnvelopeObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateManyPurchaseRequestInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateManyPurchaseRequestInputEnvelope>;
export const PurchaseRequestItemCreateManyPurchaseRequestInputEnvelopeObjectZodSchema = makeSchema();

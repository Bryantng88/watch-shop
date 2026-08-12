import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputObjectSchema as PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputObjectSchema } from './PurchaseRequestIngressReceiptCreateManyPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelopeObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelope>;
export const PurchaseRequestIngressReceiptCreateManyPurchaseRequestInputEnvelopeObjectZodSchema = makeSchema();

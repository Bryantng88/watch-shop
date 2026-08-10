import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityCreateManyPurchaseRequestInputObjectSchema as PurchaseRequestActivityCreateManyPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityCreateManyPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => PurchaseRequestActivityCreateManyPurchaseRequestInputObjectSchema), z.lazy(() => PurchaseRequestActivityCreateManyPurchaseRequestInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelopeObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelope>;
export const PurchaseRequestActivityCreateManyPurchaseRequestInputEnvelopeObjectZodSchema = makeSchema();

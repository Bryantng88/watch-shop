import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityCreateManyActorInputObjectSchema as PurchaseRequestActivityCreateManyActorInputObjectSchema } from './PurchaseRequestActivityCreateManyActorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => PurchaseRequestActivityCreateManyActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityCreateManyActorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PurchaseRequestActivityCreateManyActorInputEnvelopeObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateManyActorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateManyActorInputEnvelope>;
export const PurchaseRequestActivityCreateManyActorInputEnvelopeObjectZodSchema = makeSchema();

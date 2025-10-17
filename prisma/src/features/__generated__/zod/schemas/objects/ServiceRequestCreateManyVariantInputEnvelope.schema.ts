import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateManyVariantInputObjectSchema as ServiceRequestCreateManyVariantInputObjectSchema } from './ServiceRequestCreateManyVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ServiceRequestCreateManyVariantInputObjectSchema), z.lazy(() => ServiceRequestCreateManyVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ServiceRequestCreateManyVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.ServiceRequestCreateManyVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyVariantInputEnvelope>;
export const ServiceRequestCreateManyVariantInputEnvelopeObjectZodSchema = makeSchema();

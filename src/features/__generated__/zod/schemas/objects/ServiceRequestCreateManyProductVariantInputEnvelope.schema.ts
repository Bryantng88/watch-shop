import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateManyProductVariantInputObjectSchema as ServiceRequestCreateManyProductVariantInputObjectSchema } from './ServiceRequestCreateManyProductVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ServiceRequestCreateManyProductVariantInputObjectSchema), z.lazy(() => ServiceRequestCreateManyProductVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ServiceRequestCreateManyProductVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.ServiceRequestCreateManyProductVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyProductVariantInputEnvelope>;
export const ServiceRequestCreateManyProductVariantInputEnvelopeObjectZodSchema = makeSchema();

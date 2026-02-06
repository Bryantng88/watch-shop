import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateManyVendorInputObjectSchema as ServiceRequestCreateManyVendorInputObjectSchema } from './ServiceRequestCreateManyVendorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ServiceRequestCreateManyVendorInputObjectSchema), z.lazy(() => ServiceRequestCreateManyVendorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ServiceRequestCreateManyVendorInputEnvelopeObjectSchema: z.ZodType<Prisma.ServiceRequestCreateManyVendorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyVendorInputEnvelope>;
export const ServiceRequestCreateManyVendorInputEnvelopeObjectZodSchema = makeSchema();

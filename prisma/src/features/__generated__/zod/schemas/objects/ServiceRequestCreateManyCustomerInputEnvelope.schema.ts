import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateManyCustomerInputObjectSchema as ServiceRequestCreateManyCustomerInputObjectSchema } from './ServiceRequestCreateManyCustomerInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ServiceRequestCreateManyCustomerInputObjectSchema), z.lazy(() => ServiceRequestCreateManyCustomerInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ServiceRequestCreateManyCustomerInputEnvelopeObjectSchema: z.ZodType<Prisma.ServiceRequestCreateManyCustomerInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyCustomerInputEnvelope>;
export const ServiceRequestCreateManyCustomerInputEnvelopeObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateManyProductInputObjectSchema as ServiceRequestCreateManyProductInputObjectSchema } from './ServiceRequestCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ServiceRequestCreateManyProductInputObjectSchema), z.lazy(() => ServiceRequestCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ServiceRequestCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.ServiceRequestCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyProductInputEnvelope>;
export const ServiceRequestCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();

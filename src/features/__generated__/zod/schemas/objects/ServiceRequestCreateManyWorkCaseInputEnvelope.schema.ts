import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateManyWorkCaseInputObjectSchema as ServiceRequestCreateManyWorkCaseInputObjectSchema } from './ServiceRequestCreateManyWorkCaseInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ServiceRequestCreateManyWorkCaseInputObjectSchema), z.lazy(() => ServiceRequestCreateManyWorkCaseInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ServiceRequestCreateManyWorkCaseInputEnvelopeObjectSchema: z.ZodType<Prisma.ServiceRequestCreateManyWorkCaseInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyWorkCaseInputEnvelope>;
export const ServiceRequestCreateManyWorkCaseInputEnvelopeObjectZodSchema = makeSchema();

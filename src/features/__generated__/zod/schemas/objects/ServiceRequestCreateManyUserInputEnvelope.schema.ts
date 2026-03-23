import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateManyUserInputObjectSchema as ServiceRequestCreateManyUserInputObjectSchema } from './ServiceRequestCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ServiceRequestCreateManyUserInputObjectSchema), z.lazy(() => ServiceRequestCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ServiceRequestCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.ServiceRequestCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyUserInputEnvelope>;
export const ServiceRequestCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();

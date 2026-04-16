import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateManyOrderItemInputObjectSchema as ServiceRequestCreateManyOrderItemInputObjectSchema } from './ServiceRequestCreateManyOrderItemInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ServiceRequestCreateManyOrderItemInputObjectSchema), z.lazy(() => ServiceRequestCreateManyOrderItemInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ServiceRequestCreateManyOrderItemInputEnvelopeObjectSchema: z.ZodType<Prisma.ServiceRequestCreateManyOrderItemInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyOrderItemInputEnvelope>;
export const ServiceRequestCreateManyOrderItemInputEnvelopeObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionEventDeliveryCreateManyBusinessEventLogInputObjectSchema as ProjectionEventDeliveryCreateManyBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryCreateManyBusinessEventLogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProjectionEventDeliveryCreateManyBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryCreateManyBusinessEventLogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelopeObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelope>;
export const ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelopeObjectZodSchema = makeSchema();

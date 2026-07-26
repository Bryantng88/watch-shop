import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  attempts: z.literal(true).optional()
}).strict();
export const ProjectionEventDeliveryAvgAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryAvgAggregateInputType>;
export const ProjectionEventDeliveryAvgAggregateInputObjectZodSchema = makeSchema();

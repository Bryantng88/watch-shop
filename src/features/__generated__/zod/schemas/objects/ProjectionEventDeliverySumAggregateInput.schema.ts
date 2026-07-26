import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  attempts: z.literal(true).optional()
}).strict();
export const ProjectionEventDeliverySumAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliverySumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliverySumAggregateInputType>;
export const ProjectionEventDeliverySumAggregateInputObjectZodSchema = makeSchema();

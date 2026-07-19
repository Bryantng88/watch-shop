import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  projectionVersion: z.literal(true).optional()
}).strict();
export const ProjectionRecordSumAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionRecordSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordSumAggregateInputType>;
export const ProjectionRecordSumAggregateInputObjectZodSchema = makeSchema();

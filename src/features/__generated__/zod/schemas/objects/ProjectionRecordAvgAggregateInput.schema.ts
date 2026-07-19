import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  projectionVersion: z.literal(true).optional()
}).strict();
export const ProjectionRecordAvgAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionRecordAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordAvgAggregateInputType>;
export const ProjectionRecordAvgAggregateInputObjectZodSchema = makeSchema();

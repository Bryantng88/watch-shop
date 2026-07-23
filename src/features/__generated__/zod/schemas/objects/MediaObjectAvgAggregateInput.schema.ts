import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sizeBytes: z.literal(true).optional()
}).strict();
export const MediaObjectAvgAggregateInputObjectSchema: z.ZodType<Prisma.MediaObjectAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectAvgAggregateInputType>;
export const MediaObjectAvgAggregateInputObjectZodSchema = makeSchema();

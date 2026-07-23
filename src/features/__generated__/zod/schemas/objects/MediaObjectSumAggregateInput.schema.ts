import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sizeBytes: z.literal(true).optional()
}).strict();
export const MediaObjectSumAggregateInputObjectSchema: z.ZodType<Prisma.MediaObjectSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectSumAggregateInputType>;
export const MediaObjectSumAggregateInputObjectZodSchema = makeSchema();

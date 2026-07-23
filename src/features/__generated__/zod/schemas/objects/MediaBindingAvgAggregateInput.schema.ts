import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const MediaBindingAvgAggregateInputObjectSchema: z.ZodType<Prisma.MediaBindingAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingAvgAggregateInputType>;
export const MediaBindingAvgAggregateInputObjectZodSchema = makeSchema();

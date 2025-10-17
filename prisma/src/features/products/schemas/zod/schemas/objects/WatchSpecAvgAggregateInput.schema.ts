import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  length: z.literal(true).optional(),
  width: z.literal(true).optional(),
  thickness: z.literal(true).optional(),
  goldKarat: z.literal(true).optional()
}).strict();
export const WatchSpecAvgAggregateInputObjectSchema: z.ZodType<Prisma.WatchSpecAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecAvgAggregateInputType>;
export const WatchSpecAvgAggregateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  serviceExpectedWorkingDays: z.literal(true).optional()
}).strict();
export const WatchAvgAggregateInputObjectSchema: z.ZodType<Prisma.WatchAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchAvgAggregateInputType>;
export const WatchAvgAggregateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  serviceExpectedWorkingDays: z.literal(true).optional()
}).strict();
export const WatchSumAggregateInputObjectSchema: z.ZodType<Prisma.WatchSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchSumAggregateInputType>;
export const WatchSumAggregateInputObjectZodSchema = makeSchema();

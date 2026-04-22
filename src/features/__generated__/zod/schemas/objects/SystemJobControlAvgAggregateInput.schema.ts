import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  batchSize: z.literal(true).optional()
}).strict();
export const SystemJobControlAvgAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobControlAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlAvgAggregateInputType>;
export const SystemJobControlAvgAggregateInputObjectZodSchema = makeSchema();

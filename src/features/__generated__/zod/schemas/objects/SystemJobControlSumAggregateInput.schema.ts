import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  batchSize: z.literal(true).optional()
}).strict();
export const SystemJobControlSumAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobControlSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlSumAggregateInputType>;
export const SystemJobControlSumAggregateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  attempts: z.literal(true).optional()
}).strict();
export const MediaOperationSumAggregateInputObjectSchema: z.ZodType<Prisma.MediaOperationSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationSumAggregateInputType>;
export const MediaOperationSumAggregateInputObjectZodSchema = makeSchema();

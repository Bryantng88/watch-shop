import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  attempts: z.literal(true).optional()
}).strict();
export const MediaOperationAvgAggregateInputObjectSchema: z.ZodType<Prisma.MediaOperationAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationAvgAggregateInputType>;
export const MediaOperationAvgAggregateInputObjectZodSchema = makeSchema();

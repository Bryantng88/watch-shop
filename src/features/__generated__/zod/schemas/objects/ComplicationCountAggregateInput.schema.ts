import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ComplicationCountAggregateInputObjectSchema: z.ZodType<Prisma.ComplicationCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationCountAggregateInputType>;
export const ComplicationCountAggregateInputObjectZodSchema = makeSchema();

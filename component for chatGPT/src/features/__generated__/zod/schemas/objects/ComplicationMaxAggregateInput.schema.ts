import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
export const ComplicationMaxAggregateInputObjectSchema: z.ZodType<Prisma.ComplicationMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationMaxAggregateInputType>;
export const ComplicationMaxAggregateInputObjectZodSchema = makeSchema();

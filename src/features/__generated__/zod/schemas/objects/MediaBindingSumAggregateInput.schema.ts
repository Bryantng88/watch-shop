import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const MediaBindingSumAggregateInputObjectSchema: z.ZodType<Prisma.MediaBindingSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingSumAggregateInputType>;
export const MediaBindingSumAggregateInputObjectZodSchema = makeSchema();

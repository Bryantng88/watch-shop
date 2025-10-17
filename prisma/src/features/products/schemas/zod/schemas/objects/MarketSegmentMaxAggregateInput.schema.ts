import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
export const MarketSegmentMaxAggregateInputObjectSchema: z.ZodType<Prisma.MarketSegmentMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentMaxAggregateInputType>;
export const MarketSegmentMaxAggregateInputObjectZodSchema = makeSchema();

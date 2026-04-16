import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  estimatedCost: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  actualCost: z.literal(true).optional()
}).strict();
export const TechnicalIssueSumAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalIssueSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueSumAggregateInputType>;
export const TechnicalIssueSumAggregateInputObjectZodSchema = makeSchema();

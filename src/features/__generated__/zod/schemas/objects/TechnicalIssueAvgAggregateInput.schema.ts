import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  estimatedCost: z.literal(true).optional(),
  sortOrder: z.literal(true).optional()
}).strict();
export const TechnicalIssueAvgAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalIssueAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueAvgAggregateInputType>;
export const TechnicalIssueAvgAggregateInputObjectZodSchema = makeSchema();

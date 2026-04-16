import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  appearanceScore: z.literal(true).optional(),
  caseScore: z.literal(true).optional(),
  glassScore: z.literal(true).optional(),
  dialScore: z.literal(true).optional(),
  caseManualDeduction: z.literal(true).optional(),
  glassManualDeduction: z.literal(true).optional(),
  dialManualDeduction: z.literal(true).optional(),
  crownCost: z.literal(true).optional(),
  movementCost: z.literal(true).optional(),
  crownCostTotal: z.literal(true).optional(),
  cosmeticProposalCost: z.literal(true).optional(),
  totalCost: z.literal(true).optional()
}).strict();
export const TechnicalAssessmentsAvgAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentsAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentsAvgAggregateInputType>;
export const TechnicalAssessmentsAvgAggregateInputObjectZodSchema = makeSchema();

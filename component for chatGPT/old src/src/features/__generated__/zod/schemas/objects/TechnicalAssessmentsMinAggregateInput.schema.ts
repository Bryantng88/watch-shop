import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  serviceRequestId: z.literal(true).optional(),
  machineType: z.literal(true).optional(),
  movementStatus: z.literal(true).optional(),
  beforeRate: z.literal(true).optional(),
  beforeAmp: z.literal(true).optional(),
  beforeErr: z.literal(true).optional(),
  afterRate: z.literal(true).optional(),
  afterAmp: z.literal(true).optional(),
  afterErr: z.literal(true).optional(),
  appearanceScore: z.literal(true).optional(),
  caseScore: z.literal(true).optional(),
  glassScore: z.literal(true).optional(),
  dialScore: z.literal(true).optional(),
  caseManualDeduction: z.literal(true).optional(),
  glassManualDeduction: z.literal(true).optional(),
  dialManualDeduction: z.literal(true).optional(),
  caseNote: z.literal(true).optional(),
  glassNote: z.literal(true).optional(),
  dialNote: z.literal(true).optional(),
  crownStatus: z.literal(true).optional(),
  crownAction: z.literal(true).optional(),
  crownExecution: z.literal(true).optional(),
  crownVendorId: z.literal(true).optional(),
  crownPartId: z.literal(true).optional(),
  crownCost: z.literal(true).optional(),
  crownNote: z.literal(true).optional(),
  movementCost: z.literal(true).optional(),
  crownCostTotal: z.literal(true).optional(),
  cosmeticProposalCost: z.literal(true).optional(),
  totalCost: z.literal(true).optional(),
  conclusion: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const TechnicalAssessmentsMinAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentsMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentsMinAggregateInputType>;
export const TechnicalAssessmentsMinAggregateInputObjectZodSchema = makeSchema();

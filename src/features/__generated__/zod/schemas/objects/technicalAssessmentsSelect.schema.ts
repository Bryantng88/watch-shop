import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsFindManySchema as approvalRequestsFindManySchema } from '../findManyapprovalRequests.schema';
import { TechnicalAssessmentsCountOutputTypeArgsObjectSchema as TechnicalAssessmentsCountOutputTypeArgsObjectSchema } from './TechnicalAssessmentsCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  serviceRequestId: z.boolean().optional(),
  machineType: z.boolean().optional(),
  movementStatus: z.boolean().optional(),
  beforeRate: z.boolean().optional(),
  beforeAmp: z.boolean().optional(),
  beforeErr: z.boolean().optional(),
  afterRate: z.boolean().optional(),
  afterAmp: z.boolean().optional(),
  afterErr: z.boolean().optional(),
  appearanceScore: z.boolean().optional(),
  caseScore: z.boolean().optional(),
  glassScore: z.boolean().optional(),
  dialScore: z.boolean().optional(),
  caseIssues: z.boolean().optional(),
  glassIssues: z.boolean().optional(),
  dialIssues: z.boolean().optional(),
  caseManualDeduction: z.boolean().optional(),
  glassManualDeduction: z.boolean().optional(),
  dialManualDeduction: z.boolean().optional(),
  caseNote: z.boolean().optional(),
  glassNote: z.boolean().optional(),
  dialNote: z.boolean().optional(),
  crownStatus: z.boolean().optional(),
  crownAction: z.boolean().optional(),
  crownExecution: z.boolean().optional(),
  crownVendorId: z.boolean().optional(),
  crownPartId: z.boolean().optional(),
  crownCost: z.boolean().optional(),
  crownNote: z.boolean().optional(),
  movementCost: z.boolean().optional(),
  crownCostTotal: z.boolean().optional(),
  cosmeticProposalCost: z.boolean().optional(),
  totalCost: z.boolean().optional(),
  conclusion: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  approvalRequests: z.union([z.boolean(), z.lazy(() => approvalRequestsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const technicalAssessmentsSelectObjectSchema: z.ZodType<Prisma.technicalAssessmentsSelect> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsSelect>;
export const technicalAssessmentsSelectObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  machineType: SortOrderSchema.optional(),
  movementStatus: SortOrderSchema.optional(),
  beforeRate: SortOrderSchema.optional(),
  beforeAmp: SortOrderSchema.optional(),
  beforeErr: SortOrderSchema.optional(),
  afterRate: SortOrderSchema.optional(),
  afterAmp: SortOrderSchema.optional(),
  afterErr: SortOrderSchema.optional(),
  appearanceScore: SortOrderSchema.optional(),
  caseScore: SortOrderSchema.optional(),
  glassScore: SortOrderSchema.optional(),
  dialScore: SortOrderSchema.optional(),
  caseManualDeduction: SortOrderSchema.optional(),
  glassManualDeduction: SortOrderSchema.optional(),
  dialManualDeduction: SortOrderSchema.optional(),
  caseNote: SortOrderSchema.optional(),
  glassNote: SortOrderSchema.optional(),
  dialNote: SortOrderSchema.optional(),
  crownStatus: SortOrderSchema.optional(),
  crownAction: SortOrderSchema.optional(),
  crownExecution: SortOrderSchema.optional(),
  crownVendorId: SortOrderSchema.optional(),
  crownPartId: SortOrderSchema.optional(),
  crownCost: SortOrderSchema.optional(),
  crownNote: SortOrderSchema.optional(),
  movementCost: SortOrderSchema.optional(),
  crownCostTotal: SortOrderSchema.optional(),
  cosmeticProposalCost: SortOrderSchema.optional(),
  totalCost: SortOrderSchema.optional(),
  conclusion: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const technicalAssessmentsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsMinOrderByAggregateInput>;
export const technicalAssessmentsMinOrderByAggregateInputObjectZodSchema = makeSchema();

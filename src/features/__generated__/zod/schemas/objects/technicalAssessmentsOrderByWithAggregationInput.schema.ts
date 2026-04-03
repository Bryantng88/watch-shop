import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { technicalAssessmentsCountOrderByAggregateInputObjectSchema as technicalAssessmentsCountOrderByAggregateInputObjectSchema } from './technicalAssessmentsCountOrderByAggregateInput.schema';
import { technicalAssessmentsAvgOrderByAggregateInputObjectSchema as technicalAssessmentsAvgOrderByAggregateInputObjectSchema } from './technicalAssessmentsAvgOrderByAggregateInput.schema';
import { technicalAssessmentsMaxOrderByAggregateInputObjectSchema as technicalAssessmentsMaxOrderByAggregateInputObjectSchema } from './technicalAssessmentsMaxOrderByAggregateInput.schema';
import { technicalAssessmentsMinOrderByAggregateInputObjectSchema as technicalAssessmentsMinOrderByAggregateInputObjectSchema } from './technicalAssessmentsMinOrderByAggregateInput.schema';
import { technicalAssessmentsSumOrderByAggregateInputObjectSchema as technicalAssessmentsSumOrderByAggregateInputObjectSchema } from './technicalAssessmentsSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  machineType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movementStatus: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  beforeRate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  beforeAmp: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  beforeErr: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  afterRate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  afterAmp: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  afterErr: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  appearanceScore: SortOrderSchema.optional(),
  caseScore: SortOrderSchema.optional(),
  glassScore: SortOrderSchema.optional(),
  dialScore: SortOrderSchema.optional(),
  caseIssues: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  glassIssues: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dialIssues: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseManualDeduction: SortOrderSchema.optional(),
  glassManualDeduction: SortOrderSchema.optional(),
  dialManualDeduction: SortOrderSchema.optional(),
  caseNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  glassNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dialNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  crownStatus: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  crownAction: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  crownExecution: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  crownVendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  crownPartId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  crownCost: SortOrderSchema.optional(),
  crownNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movementCost: SortOrderSchema.optional(),
  crownCostTotal: SortOrderSchema.optional(),
  cosmeticProposalCost: SortOrderSchema.optional(),
  totalCost: SortOrderSchema.optional(),
  conclusion: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => technicalAssessmentsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => technicalAssessmentsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => technicalAssessmentsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => technicalAssessmentsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => technicalAssessmentsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const technicalAssessmentsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsOrderByWithAggregationInput>;
export const technicalAssessmentsOrderByWithAggregationInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TechnicalAssessmentCountOrderByAggregateInputObjectSchema as TechnicalAssessmentCountOrderByAggregateInputObjectSchema } from './TechnicalAssessmentCountOrderByAggregateInput.schema';
import { TechnicalAssessmentAvgOrderByAggregateInputObjectSchema as TechnicalAssessmentAvgOrderByAggregateInputObjectSchema } from './TechnicalAssessmentAvgOrderByAggregateInput.schema';
import { TechnicalAssessmentMaxOrderByAggregateInputObjectSchema as TechnicalAssessmentMaxOrderByAggregateInputObjectSchema } from './TechnicalAssessmentMaxOrderByAggregateInput.schema';
import { TechnicalAssessmentMinOrderByAggregateInputObjectSchema as TechnicalAssessmentMinOrderByAggregateInputObjectSchema } from './TechnicalAssessmentMinOrderByAggregateInput.schema';
import { TechnicalAssessmentSumOrderByAggregateInputObjectSchema as TechnicalAssessmentSumOrderByAggregateInputObjectSchema } from './TechnicalAssessmentSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  movementKind: SortOrderSchema.optional(),
  runningOk: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  batteryWeak: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  batteryIssueBattery: SortOrderSchema.optional(),
  batteryIssueIC: SortOrderSchema.optional(),
  batteryIssueCoil: SortOrderSchema.optional(),
  preRate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  preAmplitude: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  preBeatError: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  postRate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  postAmplitude: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  postBeatError: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  actionMode: SortOrderSchema.optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  diagnosis: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  conclusion: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  imageFileKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  evaluatedById: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  evaluatedByNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => TechnicalAssessmentCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TechnicalAssessmentAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TechnicalAssessmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TechnicalAssessmentMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TechnicalAssessmentSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TechnicalAssessmentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentOrderByWithAggregationInput>;
export const TechnicalAssessmentOrderByWithAggregationInputObjectZodSchema = makeSchema();

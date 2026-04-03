import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { approvalRequestsCountOrderByAggregateInputObjectSchema as approvalRequestsCountOrderByAggregateInputObjectSchema } from './approvalRequestsCountOrderByAggregateInput.schema';
import { approvalRequestsMaxOrderByAggregateInputObjectSchema as approvalRequestsMaxOrderByAggregateInputObjectSchema } from './approvalRequestsMaxOrderByAggregateInput.schema';
import { approvalRequestsMinOrderByAggregateInputObjectSchema as approvalRequestsMinOrderByAggregateInputObjectSchema } from './approvalRequestsMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  sourceModule: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  technicalAssessmentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  summary: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  autoApproved: SortOrderSchema.optional(),
  payloadJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reviewNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => approvalRequestsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => approvalRequestsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => approvalRequestsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const approvalRequestsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.approvalRequestsOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsOrderByWithAggregationInput>;
export const approvalRequestsOrderByWithAggregationInputObjectZodSchema = makeSchema();

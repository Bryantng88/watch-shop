import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  sourceModule: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  technicalAssessmentId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  summary: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  autoApproved: SortOrderSchema.optional(),
  reviewNote: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const approvalRequestsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.approvalRequestsMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsMaxOrderByAggregateInput>;
export const approvalRequestsMaxOrderByAggregateInputObjectZodSchema = makeSchema();

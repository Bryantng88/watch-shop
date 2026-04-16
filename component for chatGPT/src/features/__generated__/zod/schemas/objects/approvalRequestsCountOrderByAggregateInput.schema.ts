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
  payloadJson: SortOrderSchema.optional(),
  reviewNote: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const approvalRequestsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.approvalRequestsCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsCountOrderByAggregateInput>;
export const approvalRequestsCountOrderByAggregateInputObjectZodSchema = makeSchema();

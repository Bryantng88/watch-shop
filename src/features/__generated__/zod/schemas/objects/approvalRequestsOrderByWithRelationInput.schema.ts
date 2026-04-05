import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { technicalAssessmentsOrderByWithRelationInputObjectSchema as technicalAssessmentsOrderByWithRelationInputObjectSchema } from './technicalAssessmentsOrderByWithRelationInput.schema'

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
  technicalAssessments: z.lazy(() => technicalAssessmentsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const approvalRequestsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.approvalRequestsOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsOrderByWithRelationInput>;
export const approvalRequestsOrderByWithRelationInputObjectZodSchema = makeSchema();

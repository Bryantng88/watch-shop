import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  sourceModule: z.literal(true).optional(),
  serviceRequestId: z.literal(true).optional(),
  technicalAssessmentId: z.literal(true).optional(),
  title: z.literal(true).optional(),
  summary: z.literal(true).optional(),
  status: z.literal(true).optional(),
  autoApproved: z.literal(true).optional(),
  payloadJson: z.literal(true).optional(),
  reviewNote: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ApprovalRequestsCountAggregateInputObjectSchema: z.ZodType<Prisma.ApprovalRequestsCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ApprovalRequestsCountAggregateInputType>;
export const ApprovalRequestsCountAggregateInputObjectZodSchema = makeSchema();

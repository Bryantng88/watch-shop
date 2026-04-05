import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsArgsObjectSchema as technicalAssessmentsArgsObjectSchema } from './technicalAssessmentsArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  sourceModule: z.boolean().optional(),
  serviceRequestId: z.boolean().optional(),
  technicalAssessmentId: z.boolean().optional(),
  title: z.boolean().optional(),
  summary: z.boolean().optional(),
  status: z.boolean().optional(),
  autoApproved: z.boolean().optional(),
  payloadJson: z.boolean().optional(),
  reviewNote: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  technicalAssessments: z.union([z.boolean(), z.lazy(() => technicalAssessmentsArgsObjectSchema)]).optional()
}).strict();
export const approvalRequestsSelectObjectSchema: z.ZodType<Prisma.approvalRequestsSelect> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsSelect>;
export const approvalRequestsSelectObjectZodSchema = makeSchema();

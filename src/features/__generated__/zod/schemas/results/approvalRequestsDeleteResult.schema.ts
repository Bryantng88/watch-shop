import * as z from 'zod';
export const approvalRequestsDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  type: z.string(),
  sourceModule: z.string().optional(),
  serviceRequestId: z.string().optional(),
  technicalAssessmentId: z.string().optional(),
  title: z.string(),
  summary: z.string().optional(),
  status: z.string(),
  autoApproved: z.boolean(),
  payloadJson: z.unknown().optional(),
  reviewNote: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  technicalAssessments: z.unknown().optional()
}));
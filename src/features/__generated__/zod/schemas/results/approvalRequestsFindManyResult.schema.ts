import * as z from 'zod';
export const approvalRequestsFindManyResultSchema = z.object({
  data: z.array(z.object({
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
  technicalAssessments: z.unknown().optional(),
  maintenanceLogs: z.array(z.unknown())
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});
import * as z from 'zod';
export const maintenanceLogsFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  serviceRequestId: z.string(),
  technicalAssessmentId: z.string().optional(),
  approvalRequestId: z.string().optional(),
  sourceType: z.string(),
  category: z.string().optional(),
  action: z.string().optional(),
  execution: z.string().optional(),
  vendorId: z.string().optional(),
  partId: z.string().optional(),
  cost: z.number().int(),
  note: z.string().optional(),
  status: z.string(),
  autoApproved: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  approvalRequests: z.unknown().optional(),
  technicalAssessments: z.unknown().optional()
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
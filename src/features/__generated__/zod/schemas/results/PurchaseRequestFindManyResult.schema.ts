import * as z from 'zod';
export const PurchaseRequestFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  reference: z.string(),
  status: z.unknown(),
  outcome: z.unknown().optional(),
  channel: z.string(),
  externalRequestId: z.string().optional(),
  requestKey: z.string(),
  requestHash: z.string(),
  fingerprintHash: z.string(),
  customerName: z.string(),
  phone: z.string(),
  contactPreference: z.unknown(),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  customerNote: z.string().optional(),
  processingNote: z.string().optional(),
  completionReason: z.string().optional(),
  assignedUserId: z.string().optional(),
  followUpAt: z.date().optional(),
  processingStartedAt: z.date().optional(),
  completedAt: z.date().optional(),
  orderId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(z.unknown()),
  activities: z.array(z.unknown()),
  order: z.unknown().optional(),
  assignedUser: z.unknown().optional()
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
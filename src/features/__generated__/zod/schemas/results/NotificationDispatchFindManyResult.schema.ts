import * as z from 'zod';
export const NotificationDispatchFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  businessEventLogId: z.string().optional(),
  ruleId: z.string().optional(),
  eventKey: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  status: z.string(),
  errorMessage: z.string().optional(),
  payloadJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
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
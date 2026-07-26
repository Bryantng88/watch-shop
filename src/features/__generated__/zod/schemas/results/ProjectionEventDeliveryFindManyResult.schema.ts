import * as z from 'zod';
export const ProjectionEventDeliveryFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  idempotencyKey: z.string(),
  businessEventLogId: z.string().optional(),
  eventKey: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  actorUserId: z.string().optional(),
  effect: z.string(),
  revokeEventKey: z.string().optional(),
  targetAliasIds: z.unknown().optional(),
  eventInstanceId: z.string().optional(),
  payloadJson: z.unknown().optional(),
  status: z.string(),
  attempts: z.number().int(),
  nextAttemptAt: z.date(),
  lockedAt: z.date().optional(),
  completedAt: z.date().optional(),
  lastError: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  businessEventLog: z.unknown().optional()
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
import * as z from 'zod';
export const NotificationDispatchCreateResultSchema = z.object({
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
});
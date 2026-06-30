import * as z from 'zod';
export const NotificationRuleCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  eventKey: z.string(),
  enabled: z.boolean(),
  channel: z.string(),
  recipientGroupKey: z.string(),
  conditionJson: z.unknown().optional(),
  titleTemplate: z.string().optional(),
  messageTemplate: z.string(),
  priority: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});
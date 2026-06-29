import * as z from 'zod';
export const NotificationRuleUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  eventKey: z.string(),
  enabled: z.boolean(),
  channel: z.string(),
  recipientGroupKey: z.string(),
  titleTemplate: z.string().optional(),
  messageTemplate: z.string(),
  priority: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
}));
import * as z from 'zod';
export const NotificationRuleFindManyResultSchema = z.object({
  data: z.array(z.object({
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
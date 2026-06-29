import * as z from 'zod';
export const NotificationRecipientGroupUpsertResultSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  roleNames: z.unknown().optional(),
  userIds: z.unknown().optional(),
  zaloGroupId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});
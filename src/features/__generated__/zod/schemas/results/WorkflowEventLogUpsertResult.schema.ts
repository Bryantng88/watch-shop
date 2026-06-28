import * as z from 'zod';
export const WorkflowEventLogUpsertResultSchema = z.object({
  id: z.string(),
  eventKey: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  actorUserId: z.string().optional(),
  metadataJson: z.unknown().optional(),
  createdAt: z.date()
});
import * as z from 'zod';
export const BusinessEventLogFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  eventKey: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  actorUserId: z.string().optional(),
  metadataJson: z.unknown().optional(),
  createdAt: z.date(),
  workflowEvents: z.array(z.unknown())
}));
import * as z from 'zod';
export const TimelineEntryCreateResultSchema = z.object({
  id: z.string(),
  containerType: z.unknown(),
  containerId: z.string(),
  sourceType: z.unknown(),
  sourceId: z.string(),
  occurredAt: z.date(),
  actorUserId: z.string().optional(),
  title: z.string().optional(),
  bodySnapshot: z.string().optional(),
  visibility: z.string(),
  metadataJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});
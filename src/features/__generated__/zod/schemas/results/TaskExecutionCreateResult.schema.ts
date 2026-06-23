import * as z from 'zod';
export const TaskExecutionCreateResultSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  targetType: z.unknown(),
  targetId: z.string(),
  actionType: z.unknown(),
  metadataJson: z.unknown().optional(),
  note: z.string().optional(),
  createdByUserId: z.string().optional(),
  createdAt: z.date(),
  checklistItemId: z.string().optional(),
  serviceRequestId: z.string().optional(),
  technicalIssueId: z.string().optional(),
  taskItemId: z.string().optional(),
  task: z.unknown(),
  createdByUser: z.unknown().optional(),
  taskItem: z.unknown().optional(),
  serviceRequest: z.unknown().optional(),
  technicalIssue: z.unknown().optional()
});
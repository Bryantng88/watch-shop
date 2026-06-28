import * as z from 'zod';
export const WorkflowActionUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  workflowId: z.string(),
  actionType: z.unknown(),
  sortOrder: z.number().int(),
  configJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workflow: z.unknown()
}));
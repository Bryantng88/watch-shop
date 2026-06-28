import * as z from 'zod';
export const WorkflowConditionCreateResultSchema = z.object({
  id: z.string(),
  workflowId: z.string(),
  eventKey: z.string(),
  targetType: z.string().optional(),
  sortOrder: z.number().int(),
  configJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workflow: z.unknown()
});
import * as z from 'zod';
export const WorkflowTemplateUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.unknown(),
  strategy: z.unknown(),
  ownerType: z.string().optional(),
  ownerId: z.string().optional(),
  isSystem: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  conditions: z.array(z.unknown()),
  actions: z.array(z.unknown()),
  executions: z.array(z.unknown()),
  tags: z.array(z.unknown())
}));
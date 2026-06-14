import * as z from 'zod';
export const TaskTypeDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  domain: z.unknown(),
  defaultPriority: z.unknown(),
  completionMode: z.unknown(),
  completionRuleKey: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tasks: z.array(z.unknown()),
  taskAction: z.array(z.unknown())
}));
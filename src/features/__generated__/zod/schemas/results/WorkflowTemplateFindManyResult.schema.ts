import * as z from 'zod';
export const WorkflowTemplateFindManyResultSchema = z.object({
  data: z.array(z.object({
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
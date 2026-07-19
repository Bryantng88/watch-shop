import * as z from 'zod';
export const ProjectionRecordFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  projectionKey: z.string(),
  projectionVersion: z.number().int(),
  rowKey: z.string(),
  workspaceId: z.string().optional(),
  spaceId: z.string().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  status: z.string().optional(),
  searchText: z.string().optional(),
  sortAt: z.date().optional(),
  dataJson: z.unknown(),
  sourceUpdatedAt: z.date().optional(),
  projectedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date()
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
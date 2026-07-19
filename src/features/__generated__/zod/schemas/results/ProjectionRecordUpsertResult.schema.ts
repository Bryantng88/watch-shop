import * as z from 'zod';
export const ProjectionRecordUpsertResultSchema = z.object({
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
});
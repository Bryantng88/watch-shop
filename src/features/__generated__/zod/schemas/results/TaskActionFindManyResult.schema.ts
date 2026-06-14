import * as z from 'zod';
export const TaskActionFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  taskTypeId: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  completionMode: z.unknown(),
  completionRuleKey: z.string().optional(),
  targetType: z.unknown().optional(),
  serviceCatalogId: z.string().optional(),
  technicalDetailCatalogId: z.string().optional(),
  supplyCatalogId: z.string().optional(),
  mechanicalPartCatalogId: z.string().optional(),
  technicalActionMode: z.unknown().optional(),
  defaultTitleTemplate: z.string().optional(),
  defaultDescriptionTemplate: z.string().optional(),
  metadataJson: z.unknown().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  taskType: z.unknown(),
  tasks: z.array(z.unknown()),
  serviceCatalog: z.unknown().optional(),
  technicalDetailCatalog: z.unknown().optional(),
  supplyCatalog: z.unknown().optional(),
  mechanicalPartCatalog: z.unknown().optional()
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
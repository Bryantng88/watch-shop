import * as z from 'zod';

export const TaskActionScalarFieldEnumSchema = z.enum(['id', 'taskTypeId', 'code', 'name', 'description', 'completionMode', 'completionRuleKey', 'targetType', 'serviceCatalogId', 'technicalDetailCatalogId', 'supplyCatalogId', 'mechanicalPartCatalogId', 'technicalActionMode', 'defaultTitleTemplate', 'defaultDescriptionTemplate', 'metadataJson', 'isActive', 'sortOrder', 'createdAt', 'updatedAt'])

export type TaskActionScalarFieldEnum = z.infer<typeof TaskActionScalarFieldEnumSchema>;
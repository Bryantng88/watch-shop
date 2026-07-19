import * as z from 'zod';

export const ProjectionRecordScalarFieldEnumSchema = z.enum(['id', 'projectionKey', 'projectionVersion', 'rowKey', 'workspaceId', 'spaceId', 'entityType', 'entityId', 'status', 'searchText', 'sortAt', 'dataJson', 'sourceUpdatedAt', 'projectedAt', 'createdAt', 'updatedAt'])

export type ProjectionRecordScalarFieldEnum = z.infer<typeof ProjectionRecordScalarFieldEnumSchema>;
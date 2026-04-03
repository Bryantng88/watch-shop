import * as z from 'zod';

export const MaintenanceLogsScalarFieldEnumSchema = z.enum(['id', 'serviceRequestId', 'technicalAssessmentId', 'approvalRequestId', 'sourceType', 'category', 'action', 'execution', 'vendorId', 'partId', 'cost', 'note', 'status', 'autoApproved', 'createdAt', 'updatedAt'])

export type MaintenanceLogsScalarFieldEnum = z.infer<typeof MaintenanceLogsScalarFieldEnumSchema>;
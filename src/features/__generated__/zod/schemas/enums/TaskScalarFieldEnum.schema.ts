import * as z from 'zod';

export const TaskScalarFieldEnumSchema = z.enum(['id', 'title', 'description', 'source', 'taskTypeId', 'status', 'priority', 'kind', 'dueAt', 'startedAt', 'completedAt', 'cancelledAt', 'createdByUserId', 'assignedToUserId', 'completedByUserId', 'cancelledByUserId', 'watchId', 'orderId', 'shipmentId', 'acquisitionId', 'serviceRequestId', 'technicalIssueId', 'paymentId', 'workCaseId', 'createdAt', 'updatedAt', 'taskActionId'])

export type TaskScalarFieldEnum = z.infer<typeof TaskScalarFieldEnumSchema>;
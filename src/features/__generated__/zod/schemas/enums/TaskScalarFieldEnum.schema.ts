import * as z from 'zod';

export const TaskScalarFieldEnumSchema = z.enum(['id', 'title', 'description', 'source', 'kind', 'status', 'priority', 'dueAt', 'startedAt', 'completedAt', 'cancelledAt', 'createdByUserId', 'assignedToUserId', 'completedByUserId', 'cancelledByUserId', 'watchId', 'orderId', 'shipmentId', 'acquisitionId', 'serviceRequestId', 'technicalIssueId', 'paymentId', 'createdAt', 'updatedAt'])

export type TaskScalarFieldEnum = z.infer<typeof TaskScalarFieldEnumSchema>;
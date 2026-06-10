import * as z from 'zod';

<<<<<<< HEAD
export const TaskScalarFieldEnumSchema = z.enum(['id', 'title', 'description', 'source', 'kind', 'status', 'priority', 'dueAt', 'startedAt', 'completedAt', 'cancelledAt', 'createdByUserId', 'assignedToUserId', 'completedByUserId', 'cancelledByUserId', 'watchId', 'orderId', 'shipmentId', 'acquisitionId', 'serviceRequestId', 'technicalIssueId', 'paymentId', 'taskTypeId', 'createdAt', 'updatedAt'])
=======
export const TaskScalarFieldEnumSchema = z.enum(['id', 'title', 'description', 'source', 'kind', 'status', 'priority', 'dueAt', 'startedAt', 'completedAt', 'cancelledAt', 'createdByUserId', 'assignedToUserId', 'completedByUserId', 'cancelledByUserId', 'watchId', 'orderId', 'shipmentId', 'acquisitionId', 'serviceRequestId', 'technicalIssueId', 'paymentId', 'workCaseId', 'createdAt', 'updatedAt'])
>>>>>>> a011cbb2d4ad4063b85485297cbe895b7833bd15

export type TaskScalarFieldEnum = z.infer<typeof TaskScalarFieldEnumSchema>;
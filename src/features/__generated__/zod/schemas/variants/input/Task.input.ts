import * as z from 'zod';

import { TaskSourceSchema } from '../../enums/TaskSource.schema';
import { TaskDomainSchema } from '../../enums/TaskDomain.schema';
import { TaskModeSchema } from '../../enums/TaskMode.schema';
import { TaskStatusSchema } from '../../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../../enums/TaskPriority.schema';
// prettier-ignore
export const TaskInputSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional().nullable(),
    source: TaskSourceSchema,
    domain: TaskDomainSchema,
    taskTypeId: z.string().optional().nullable(),
    mode: TaskModeSchema,
    status: TaskStatusSchema,
    priority: TaskPrioritySchema,
    dueAt: z.date().optional().nullable(),
    startedAt: z.date().optional().nullable(),
    completedAt: z.date().optional().nullable(),
    cancelledAt: z.date().optional().nullable(),
    createdByUserId: z.string().optional().nullable(),
    assignedToUserId: z.string().optional().nullable(),
    completedByUserId: z.string().optional().nullable(),
    cancelledByUserId: z.string().optional().nullable(),
    watchId: z.string().optional().nullable(),
    orderId: z.string().optional().nullable(),
    shipmentId: z.string().optional().nullable(),
    acquisitionId: z.string().optional().nullable(),
    serviceRequestId: z.string().optional().nullable(),
    technicalIssueId: z.string().optional().nullable(),
    paymentId: z.string().optional().nullable(),
    workCaseId: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdByUser: z.unknown().optional().nullable(),
    assignedToUser: z.unknown().optional().nullable(),
    completedByUser: z.unknown().optional().nullable(),
    cancelledByUser: z.unknown().optional().nullable(),
    watch: z.unknown().optional().nullable(),
    order: z.unknown().optional().nullable(),
    shipment: z.unknown().optional().nullable(),
    acquisition: z.unknown().optional().nullable(),
    serviceRequest: z.unknown().optional().nullable(),
    technicalIssue: z.unknown().optional().nullable(),
    payment: z.unknown().optional().nullable(),
    workCase: z.unknown().optional().nullable(),
    taskType: z.unknown().optional().nullable(),
    executions: z.array(z.unknown()),
    notifications: z.array(z.unknown())
}).strict();

export type TaskInputType = z.infer<typeof TaskInputSchema>;

import * as z from 'zod';

import { TaskSourceSchema } from '../../enums/TaskSource.schema';
import { TaskStatusSchema } from '../../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../../enums/TaskPriority.schema';
import { TaskKindSchema } from '../../enums/TaskKind.schema';
import { TaskPeriodSchema } from '../../enums/TaskPeriod.schema';
// prettier-ignore
export const TaskResultSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    source: TaskSourceSchema,
    taskTypeId: z.string().nullable(),
    status: TaskStatusSchema,
    priority: TaskPrioritySchema,
    kind: TaskKindSchema,
    periodType: TaskPeriodSchema.nullable(),
    periodKey: z.string().nullable(),
    dueAt: z.date().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    cancelledAt: z.date().nullable(),
    createdByUserId: z.string().nullable(),
    assignedToUserId: z.string().nullable(),
    completedByUserId: z.string().nullable(),
    cancelledByUserId: z.string().nullable(),
    watchId: z.string().nullable(),
    orderId: z.string().nullable(),
    shipmentId: z.string().nullable(),
    acquisitionId: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    technicalIssueId: z.string().nullable(),
    paymentId: z.string().nullable(),
    workCaseId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdByUser: z.unknown().nullable(),
    assignedToUser: z.unknown().nullable(),
    completedByUser: z.unknown().nullable(),
    cancelledByUser: z.unknown().nullable(),
    checklistItems: z.array(z.unknown()),
    taskItems: z.array(z.unknown()),
    watch: z.unknown().nullable(),
    order: z.unknown().nullable(),
    shipment: z.unknown().nullable(),
    acquisition: z.unknown().nullable(),
    serviceRequest: z.unknown().nullable(),
    technicalIssue: z.unknown().nullable(),
    payment: z.unknown().nullable(),
    workCase: z.unknown().nullable(),
    executions: z.array(z.unknown()),
    notifications: z.array(z.unknown()),
    taskActionId: z.string().nullable()
}).strict();

export type TaskResultType = z.infer<typeof TaskResultSchema>;

import * as z from 'zod';

import { TaskSourceSchema } from '../../enums/TaskSource.schema';
import { TaskKindSchema } from '../../enums/TaskKind.schema';
import { TaskStatusSchema } from '../../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../../enums/TaskPriority.schema';
// prettier-ignore
export const TaskInputSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional().nullable(),
    source: TaskSourceSchema,
    kind: TaskKindSchema,
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
    notifications: z.array(z.unknown())
}).strict();

export type TaskInputType = z.infer<typeof TaskInputSchema>;

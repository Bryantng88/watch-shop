import * as z from 'zod';

import { WorkCaseScopeSchema } from '../../enums/WorkCaseScope.schema';
import { WorkCaseStatusSchema } from '../../enums/WorkCaseStatus.schema';
import { TaskPrioritySchema } from '../../enums/TaskPriority.schema';
// prettier-ignore
export const WorkCaseModelSchema = z.object({
    id: z.string(),
    refNo: z.string().nullable(),
    title: z.string(),
    description: z.string().nullable(),
    scope: WorkCaseScopeSchema,
    status: WorkCaseStatusSchema,
    priority: TaskPrioritySchema,
    watchId: z.string().nullable(),
    categoryId: z.string().nullable(),
    orderId: z.string().nullable(),
    shipmentId: z.string().nullable(),
    raisedByUserId: z.string().nullable(),
    assignedToUserId: z.string().nullable(),
    triagedAt: z.date().nullable(),
    resolvedAt: z.date().nullable(),
    cancelledAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown().nullable(),
    order: z.unknown().nullable(),
    shipment: z.unknown().nullable(),
    category: z.unknown().nullable(),
    raisedByUser: z.unknown().nullable(),
    assignedToUser: z.unknown().nullable(),
    tasks: z.array(z.unknown()),
    serviceRequests: z.array(z.unknown()),
    activities: z.array(z.unknown())
}).strict();

export type WorkCasePureType = z.infer<typeof WorkCaseModelSchema>;

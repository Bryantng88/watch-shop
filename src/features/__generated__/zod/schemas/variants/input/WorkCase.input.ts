import * as z from 'zod';

import { WorkCaseScopeSchema } from '../../enums/WorkCaseScope.schema';
import { WorkCaseStatusSchema } from '../../enums/WorkCaseStatus.schema';
import { TaskPrioritySchema } from '../../enums/TaskPriority.schema';
// prettier-ignore
export const WorkCaseInputSchema = z.object({
    id: z.string(),
    refNo: z.string().optional().nullable(),
    title: z.string(),
    description: z.string().optional().nullable(),
    scope: WorkCaseScopeSchema,
    status: WorkCaseStatusSchema,
    priority: TaskPrioritySchema,
    watchId: z.string(),
    categoryId: z.string().optional().nullable(),
    raisedByUserId: z.string().optional().nullable(),
    assignedToUserId: z.string().optional().nullable(),
    triagedAt: z.date().optional().nullable(),
    resolvedAt: z.date().optional().nullable(),
    cancelledAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown(),
    category: z.unknown().optional().nullable(),
    raisedByUser: z.unknown().optional().nullable(),
    assignedToUser: z.unknown().optional().nullable(),
    tasks: z.array(z.unknown()),
    serviceRequests: z.array(z.unknown()),
    activities: z.array(z.unknown())
}).strict();

export type WorkCaseInputType = z.infer<typeof WorkCaseInputSchema>;

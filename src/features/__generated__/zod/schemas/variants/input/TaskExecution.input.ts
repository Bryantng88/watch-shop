import * as z from 'zod';

import { TaskExecutionTargetTypeSchema } from '../../enums/TaskExecutionTargetType.schema';
import { TaskExecutionActionTypeSchema } from '../../enums/TaskExecutionActionType.schema';
// prettier-ignore
export const TaskExecutionInputSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    targetType: TaskExecutionTargetTypeSchema,
    targetId: z.string(),
    actionType: TaskExecutionActionTypeSchema,
    metadataJson: z.unknown().optional().nullable(),
    note: z.string().optional().nullable(),
    createdByUserId: z.string().optional().nullable(),
    createdAt: z.date(),
    serviceRequestId: z.string().optional().nullable(),
    technicalIssueId: z.string().optional().nullable(),
    taskItemId: z.string().optional().nullable(),
    task: z.unknown(),
    createdByUser: z.unknown().optional().nullable(),
    taskItem: z.unknown().optional().nullable(),
    serviceRequest: z.unknown().optional().nullable(),
    technicalIssue: z.unknown().optional().nullable()
}).strict();

export type TaskExecutionInputType = z.infer<typeof TaskExecutionInputSchema>;

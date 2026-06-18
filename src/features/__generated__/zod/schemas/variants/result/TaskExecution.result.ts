import * as z from 'zod';

import { TaskExecutionTargetTypeSchema } from '../../enums/TaskExecutionTargetType.schema';
import { TaskExecutionActionTypeSchema } from '../../enums/TaskExecutionActionType.schema';
// prettier-ignore
export const TaskExecutionResultSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    targetType: TaskExecutionTargetTypeSchema,
    targetId: z.string(),
    actionType: TaskExecutionActionTypeSchema,
    metadataJson: z.unknown().nullable(),
    note: z.string().nullable(),
    createdByUserId: z.string().nullable(),
    createdAt: z.date(),
    checklistItemId: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    technicalIssueId: z.string().nullable(),
    task: z.unknown(),
    createdByUser: z.unknown().nullable(),
    checklistItem: z.unknown().nullable(),
    serviceRequest: z.unknown().nullable(),
    technicalIssue: z.unknown().nullable()
}).strict();

export type TaskExecutionResultType = z.infer<typeof TaskExecutionResultSchema>;

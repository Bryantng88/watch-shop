import * as z from 'zod';

import { ActivitySourceTypeSchema } from '../../enums/ActivitySourceType.schema';
import { ActivityStatusSchema } from '../../enums/ActivityStatus.schema';
// prettier-ignore
export const TaskItemActivityInputSchema = z.object({
    id: z.string(),
    taskItemId: z.string(),
    sourceType: ActivitySourceTypeSchema,
    sourceId: z.string().optional().nullable(),
    title: z.string(),
    body: z.string().optional().nullable(),
    status: ActivityStatusSchema,
    actorUserId: z.string().optional().nullable(),
    metadataJson: z.unknown().optional().nullable(),
    occurredAt: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
    taskItem: z.unknown(),
    actorUser: z.unknown().optional().nullable(),
    replies: z.array(z.unknown())
}).strict();

export type TaskItemActivityInputType = z.infer<typeof TaskItemActivityInputSchema>;

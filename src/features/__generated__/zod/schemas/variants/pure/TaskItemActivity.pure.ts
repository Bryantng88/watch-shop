import * as z from 'zod';

import { ActivitySourceTypeSchema } from '../../enums/ActivitySourceType.schema';
import { ActivityStatusSchema } from '../../enums/ActivityStatus.schema';
// prettier-ignore
export const TaskItemActivityModelSchema = z.object({
    id: z.string(),
    taskItemId: z.string(),
    sourceType: ActivitySourceTypeSchema,
    sourceId: z.string().nullable(),
    title: z.string(),
    body: z.string().nullable(),
    status: ActivityStatusSchema,
    actorUserId: z.string().nullable(),
    metadataJson: z.unknown().nullable(),
    occurredAt: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
    taskItem: z.unknown(),
    actorUser: z.unknown().nullable(),
    replies: z.array(z.unknown())
}).strict();

export type TaskItemActivityPureType = z.infer<typeof TaskItemActivityModelSchema>;

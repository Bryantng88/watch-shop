import * as z from 'zod';

import { TimelineContainerTypeSchema } from '../../enums/TimelineContainerType.schema';
import { TimelineSourceTypeSchema } from '../../enums/TimelineSourceType.schema';
// prettier-ignore
export const TimelineEntryModelSchema = z.object({
    id: z.string(),
    containerType: TimelineContainerTypeSchema,
    containerId: z.string(),
    sourceType: TimelineSourceTypeSchema,
    sourceId: z.string(),
    occurredAt: z.date(),
    actorUserId: z.string().nullable(),
    title: z.string().nullable(),
    bodySnapshot: z.string().nullable(),
    visibility: z.string(),
    metadataJson: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type TimelineEntryPureType = z.infer<typeof TimelineEntryModelSchema>;

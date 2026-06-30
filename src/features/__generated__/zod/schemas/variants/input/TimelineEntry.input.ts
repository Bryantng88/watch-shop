import * as z from 'zod';

import { TimelineContainerTypeSchema } from '../../enums/TimelineContainerType.schema';
import { TimelineSourceTypeSchema } from '../../enums/TimelineSourceType.schema';
// prettier-ignore
export const TimelineEntryInputSchema = z.object({
    id: z.string(),
    containerType: TimelineContainerTypeSchema,
    containerId: z.string(),
    sourceType: TimelineSourceTypeSchema,
    sourceId: z.string(),
    occurredAt: z.date(),
    actorUserId: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    bodySnapshot: z.string().optional().nullable(),
    visibility: z.string(),
    metadataJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type TimelineEntryInputType = z.infer<typeof TimelineEntryInputSchema>;

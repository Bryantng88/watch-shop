import * as z from 'zod';

import { MediaOwnerTypeSchema } from '../../enums/MediaOwnerType.schema';
import { MediaRoleSchema } from '../../enums/MediaRole.schema';
import { AudienceSegmentSchema } from '../../enums/AudienceSegment.schema';
import { MediaBindingLifecycleSchema } from '../../enums/MediaBindingLifecycle.schema';
import { MediaPipelineKeySchema } from '../../enums/MediaPipelineKey.schema';
// prettier-ignore
export const MediaBindingInputSchema = z.object({
    id: z.string(),
    mediaObjectId: z.string(),
    ownerType: MediaOwnerTypeSchema,
    ownerId: z.string(),
    role: MediaRoleSchema,
    sortOrder: z.number().int(),
    audienceSegment: AudienceSegmentSchema,
    lifecycle: MediaBindingLifecycleSchema,
    pipelineKey: MediaPipelineKeySchema.optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    mediaObject: z.unknown()
}).strict();

export type MediaBindingInputType = z.infer<typeof MediaBindingInputSchema>;

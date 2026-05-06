import * as z from 'zod';

import { WatchReviewActionSchema } from '../../enums/WatchReviewAction.schema';
import { WatchReviewStatusSchema } from '../../enums/WatchReviewStatus.schema';
// prettier-ignore
export const WatchReviewLogModelSchema = z.object({
    id: z.string(),
    reviewStateId: z.string(),
    action: WatchReviewActionSchema,
    fromStatus: WatchReviewStatusSchema.nullable(),
    toStatus: WatchReviewStatusSchema,
    actorId: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date(),
    reviewState: z.unknown()
}).strict();

export type WatchReviewLogPureType = z.infer<typeof WatchReviewLogModelSchema>;

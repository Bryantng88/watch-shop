import * as z from 'zod';

import { WatchReviewActionSchema } from '../../enums/WatchReviewAction.schema';
import { WatchReviewStatusSchema } from '../../enums/WatchReviewStatus.schema';
// prettier-ignore
export const WatchReviewLogInputSchema = z.object({
    id: z.string(),
    reviewStateId: z.string(),
    action: WatchReviewActionSchema,
    fromStatus: WatchReviewStatusSchema.optional().nullable(),
    toStatus: WatchReviewStatusSchema,
    actorId: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    createdAt: z.date(),
    reviewState: z.unknown()
}).strict();

export type WatchReviewLogInputType = z.infer<typeof WatchReviewLogInputSchema>;

import * as z from 'zod';

import { WatchReviewTargetTypeSchema } from '../../enums/WatchReviewTargetType.schema';
import { WatchReviewStatusSchema } from '../../enums/WatchReviewStatus.schema';
// prettier-ignore
export const WatchReviewStateResultSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    productId: z.string(),
    targetType: WatchReviewTargetTypeSchema,
    status: WatchReviewStatusSchema,
    submittedAt: z.date().nullable(),
    submittedById: z.string().nullable(),
    reviewedAt: z.date().nullable(),
    reviewedById: z.string().nullable(),
    reviewNote: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown(),
    WatchReviewLog: z.array(z.unknown())
}).strict();

export type WatchReviewStateResultType = z.infer<typeof WatchReviewStateResultSchema>;

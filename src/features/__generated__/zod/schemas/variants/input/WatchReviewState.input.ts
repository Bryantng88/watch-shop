import * as z from 'zod';

import { WatchReviewTargetTypeSchema } from '../../enums/WatchReviewTargetType.schema';
import { WatchReviewStatusSchema } from '../../enums/WatchReviewStatus.schema';
// prettier-ignore
export const WatchReviewStateInputSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    productId: z.string(),
    targetType: WatchReviewTargetTypeSchema,
    status: WatchReviewStatusSchema,
    submittedAt: z.date().optional().nullable(),
    submittedById: z.string().optional().nullable(),
    reviewedAt: z.date().optional().nullable(),
    reviewedById: z.string().optional().nullable(),
    reviewNote: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown(),
    WatchReviewLog: z.array(z.unknown())
}).strict();

export type WatchReviewStateInputType = z.infer<typeof WatchReviewStateInputSchema>;

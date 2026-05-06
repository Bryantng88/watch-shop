import * as z from 'zod';

export const WatchReviewTargetTypeSchema = z.enum(['CONTENT', 'IMAGE'])

export type WatchReviewTargetType = z.infer<typeof WatchReviewTargetTypeSchema>;
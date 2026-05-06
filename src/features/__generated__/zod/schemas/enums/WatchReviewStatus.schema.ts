import * as z from 'zod';

export const WatchReviewStatusSchema = z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'])

export type WatchReviewStatus = z.infer<typeof WatchReviewStatusSchema>;
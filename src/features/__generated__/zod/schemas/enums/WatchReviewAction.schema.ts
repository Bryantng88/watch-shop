import * as z from 'zod';

export const WatchReviewActionSchema = z.enum(['SUBMIT', 'APPROVE', 'REJECT', 'RESET_DRAFT', 'AUTO_APPROVE'])

export type WatchReviewAction = z.infer<typeof WatchReviewActionSchema>;
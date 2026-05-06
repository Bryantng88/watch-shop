import * as z from 'zod';

export const WatchReviewLogScalarFieldEnumSchema = z.enum(['id', 'reviewStateId', 'action', 'fromStatus', 'toStatus', 'actorId', 'note', 'createdAt'])

export type WatchReviewLogScalarFieldEnum = z.infer<typeof WatchReviewLogScalarFieldEnumSchema>;
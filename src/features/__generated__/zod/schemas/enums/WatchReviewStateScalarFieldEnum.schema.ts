import * as z from 'zod';

export const WatchReviewStateScalarFieldEnumSchema = z.enum(['id', 'watchId', 'productId', 'targetType', 'status', 'submittedAt', 'submittedById', 'reviewedAt', 'reviewedById', 'reviewNote', 'createdAt', 'updatedAt'])

export type WatchReviewStateScalarFieldEnum = z.infer<typeof WatchReviewStateScalarFieldEnumSchema>;
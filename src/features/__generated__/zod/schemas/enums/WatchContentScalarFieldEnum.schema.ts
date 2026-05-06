import * as z from 'zod';

export const WatchContentScalarFieldEnumSchema = z.enum(['id', 'watchId', 'titleOverride', 'summary', 'hookText', 'body', 'bulletSpecs', 'seoTitle', 'seoDescription', 'aiMetaJson', 'createdAt', 'updatedAt', 'contentStatus', 'submittedAt', 'submittedById', 'reviewedAt', 'reviewedById', 'reviewNote', 'publishedAt', 'publishedById'])

export type WatchContentScalarFieldEnum = z.infer<typeof WatchContentScalarFieldEnumSchema>;
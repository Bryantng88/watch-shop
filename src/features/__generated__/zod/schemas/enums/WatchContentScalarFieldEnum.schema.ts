import * as z from 'zod';

export const WatchContentScalarFieldEnumSchema = z.enum(['id', 'watchId', 'titleOverride', 'summary', 'hookText', 'body', 'bulletSpecs', 'seoTitle', 'seoDescription', 'aiMetaJson', 'createdAt', 'updatedAt'])

export type WatchContentScalarFieldEnum = z.infer<typeof WatchContentScalarFieldEnumSchema>;
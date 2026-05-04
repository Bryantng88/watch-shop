import * as z from 'zod';

export const MediaAssetScalarFieldEnumSchema = z.enum(['id', 'key', 'parentPrefix', 'fileName', 'ext', 'sizeBytes', 'etag', 'lastModified', 'profile', 'createdAt', 'updatedAt'])

export type MediaAssetScalarFieldEnum = z.infer<typeof MediaAssetScalarFieldEnumSchema>;
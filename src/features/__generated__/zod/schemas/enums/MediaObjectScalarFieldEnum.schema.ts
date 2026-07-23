import * as z from 'zod';

export const MediaObjectScalarFieldEnumSchema = z.enum(['id', 'bucket', 'storageKey', 'originalFileName', 'mimeType', 'sizeBytes', 'checksum', 'etag', 'availability', 'verifiedAt', 'missingAt', 'createdAt', 'updatedAt'])

export type MediaObjectScalarFieldEnum = z.infer<typeof MediaObjectScalarFieldEnumSchema>;
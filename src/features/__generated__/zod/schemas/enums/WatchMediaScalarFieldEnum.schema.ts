import * as z from 'zod';

export const WatchMediaScalarFieldEnumSchema = z.enum(['id', 'watchId', 'legacyProductImageId', 'key', 'url', 'type', 'role', 'sortOrder', 'alt', 'width', 'height', 'mime', 'sizeBytes', 'dominantHex', 'contentHash', 'createdAt', 'updatedAt'])

export type WatchMediaScalarFieldEnum = z.infer<typeof WatchMediaScalarFieldEnumSchema>;
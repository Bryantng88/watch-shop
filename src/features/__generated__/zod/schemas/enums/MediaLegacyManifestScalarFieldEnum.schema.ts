import * as z from 'zod';

export const MediaLegacyManifestScalarFieldEnumSchema = z.enum(['id', 'legacyMediaAssetId', 'legacyKey', 'classification', 'decision', 'physicalExists', 'productImageId', 'productId', 'acquisitionId', 'movedFromKey', 'mediaObjectId', 'note', 'scannedAt', 'migratedAt', 'createdAt', 'updatedAt'])

export type MediaLegacyManifestScalarFieldEnum = z.infer<typeof MediaLegacyManifestScalarFieldEnumSchema>;
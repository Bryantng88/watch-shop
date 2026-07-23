import * as z from 'zod';

export const MediaLegacyClassificationSchema = z.enum(['DB_AND_NAS_OK', 'WATCH_POOL_SELECTED', 'LEGACY_SOURCE_MOVED', 'DB_PRESENT_NAS_MISSING', 'PRODUCT_REFERENCE_BROKEN', 'UNBOUND', 'NEEDS_REVIEW'])

export type MediaLegacyClassification = z.infer<typeof MediaLegacyClassificationSchema>;
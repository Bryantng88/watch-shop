import * as z from 'zod';

import { MediaLegacyClassificationSchema } from '../../enums/MediaLegacyClassification.schema';
import { MediaLegacyDecisionSchema } from '../../enums/MediaLegacyDecision.schema';
// prettier-ignore
export const MediaLegacyManifestResultSchema = z.object({
    id: z.string(),
    legacyMediaAssetId: z.string(),
    legacyKey: z.string(),
    classification: MediaLegacyClassificationSchema,
    decision: MediaLegacyDecisionSchema,
    physicalExists: z.boolean(),
    productImageId: z.string().nullable(),
    productId: z.string().nullable(),
    acquisitionId: z.string().nullable(),
    movedFromKey: z.string().nullable(),
    mediaObjectId: z.string().nullable(),
    note: z.string().nullable(),
    scannedAt: z.date(),
    migratedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type MediaLegacyManifestResultType = z.infer<typeof MediaLegacyManifestResultSchema>;

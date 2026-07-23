import * as z from 'zod';

import { MediaLegacyClassificationSchema } from '../../enums/MediaLegacyClassification.schema';
import { MediaLegacyDecisionSchema } from '../../enums/MediaLegacyDecision.schema';
// prettier-ignore
export const MediaLegacyManifestInputSchema = z.object({
    id: z.string(),
    legacyMediaAssetId: z.string(),
    legacyKey: z.string(),
    classification: MediaLegacyClassificationSchema,
    decision: MediaLegacyDecisionSchema,
    physicalExists: z.boolean(),
    productImageId: z.string().optional().nullable(),
    productId: z.string().optional().nullable(),
    acquisitionId: z.string().optional().nullable(),
    movedFromKey: z.string().optional().nullable(),
    mediaObjectId: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    scannedAt: z.date(),
    migratedAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type MediaLegacyManifestInputType = z.infer<typeof MediaLegacyManifestInputSchema>;

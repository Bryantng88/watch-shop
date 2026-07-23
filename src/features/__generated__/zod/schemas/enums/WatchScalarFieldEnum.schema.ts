import * as z from 'zod';

export const WatchScalarFieldEnumSchema = z.enum(['id', 'productId', 'legacyVariantId', 'acquisitionId', 'saleStage', 'serviceStage', 'stockStage', 'siteChannel', 'gender', 'audienceSegment', 'mediaPipelineKey', 'conditionGrade', 'movementType', 'movementCalibre', 'serialNumber', 'yearText', 'style', 'hasBox', 'hasPapers', 'specStatus', 'isImageDownloaded', 'isContentDownloaded', 'notes', 'duplicateConfirmedAt', 'duplicateConfirmedByUserId', 'createdAt', 'updatedAt'])

export type WatchScalarFieldEnum = z.infer<typeof WatchScalarFieldEnumSchema>;
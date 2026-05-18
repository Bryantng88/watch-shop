import * as z from 'zod';

export const WatchScalarFieldEnumSchema = z.enum(['id', 'productId', 'legacyVariantId', 'acquisitionId', 'saleStage', 'serviceStage', 'stockState', 'siteChannel', 'gender', 'conditionGrade', 'movementType', 'movementCalibre', 'serialNumber', 'yearText', 'style', 'hasBox', 'hasPapers', 'specStatus', 'isImageDownloaded', 'isContentDownloaded', 'notes', 'createdAt', 'updatedAt'])

export type WatchScalarFieldEnum = z.infer<typeof WatchScalarFieldEnumSchema>;
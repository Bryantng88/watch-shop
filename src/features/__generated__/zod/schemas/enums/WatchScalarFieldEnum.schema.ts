import * as z from 'zod';

export const WatchScalarFieldEnumSchema = z.enum(['id', 'productId', 'legacyVariantId', 'acquisitionId', 'stockState', 'saleState', 'serviceState', 'siteChannel', 'gender', 'conditionGrade', 'movementType', 'movementCalibre', 'serialNumber', 'yearText', 'hasBox', 'hasPapers', 'specStatus', 'notes', 'createdAt', 'updatedAt'])

export type WatchScalarFieldEnum = z.infer<typeof WatchScalarFieldEnumSchema>;
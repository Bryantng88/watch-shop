import * as z from 'zod';

export const WatchScalarFieldEnumSchema = z.enum(['id', 'productId', 'legacyVariantId', 'acquisitionId', 'stockState', 'saleState', 'serviceState', 'gender', 'siteChannel', 'conditionGrade', 'movementType', 'movementCalibre', 'serialNumber', 'yearText', 'hasBox', 'hasPapers', 'attachedStrapId', 'notes', 'createdAt', 'updatedAt'])

export type WatchScalarFieldEnum = z.infer<typeof WatchScalarFieldEnumSchema>;
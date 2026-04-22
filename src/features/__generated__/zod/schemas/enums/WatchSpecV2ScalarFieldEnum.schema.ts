import * as z from 'zod';

export const WatchSpecV2ScalarFieldEnumSchema = z.enum(['id', 'watchId', 'brand', 'model', 'referenceNumber', 'nickname', 'caseShape', 'caseSizeMM', 'lugToLugMM', 'lugWidthMM', 'thicknessMM', 'materialProfile', 'primaryCaseMaterial', 'secondaryCaseMaterial', 'goldTreatment', 'goldColors', 'goldKarat', 'materialNote', 'dialColor', 'dialFinish', 'crystal', 'movementType', 'calibre', 'powerReserve', 'waterResistance', 'braceletType', 'strapMaterialText', 'buckleType', 'bookletIncluded', 'cardIncluded', 'featuresJson', 'rawSpecJson', 'createdAt', 'updatedAt'])

export type WatchSpecV2ScalarFieldEnum = z.infer<typeof WatchSpecV2ScalarFieldEnumSchema>;
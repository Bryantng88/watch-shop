import * as z from 'zod';

export const WatchSpecScalarFieldEnumSchema = z.enum(['productId', 'model', 'year', 'caseType', 'category', 'gender', 'length', 'width', 'thickness', 'movement', 'caliber', 'caseMaterial', 'goldKarat', 'goldColor', 'caseSize', 'dialColor', 'marketSegmentId', 'strap', 'glass', 'boxIncluded', 'bookletIncluded', 'cardIncluded', 'createdAt', 'updatedAt', 'sizeCategory', 'ref', 'hasStrap', 'isServiced', 'hasClasp', 'isSpa'])

export type WatchSpecScalarFieldEnum = z.infer<typeof WatchSpecScalarFieldEnumSchema>;
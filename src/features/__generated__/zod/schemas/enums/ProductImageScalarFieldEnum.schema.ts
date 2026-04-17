import * as z from 'zod';

export const ProductImageScalarFieldEnumSchema = z.enum(['id', 'productId', 'fileKey', 'role', 'alt', 'width', 'height', 'mime', 'sizeBytes', 'sortOrder', 'dominantHex', 'contentHash', 'createdAt', 'updatedAt', 'isPrimary', 'isForAdmin', 'isForStorefront'])

export type ProductImageScalarFieldEnum = z.infer<typeof ProductImageScalarFieldEnumSchema>;
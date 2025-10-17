import * as z from 'zod';

export const ProductImageScalarFieldEnumSchema = z.enum(['id', 'productId', 'fileKey', 'role', 'alt', 'width', 'height', 'mime', 'sizeBytes', 'sortOrder', 'dominantHex', 'contentHash', 'createdAt', 'updatedAt'])

export type ProductImageScalarFieldEnum = z.infer<typeof ProductImageScalarFieldEnumSchema>;
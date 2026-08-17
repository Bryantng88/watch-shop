import * as z from 'zod';

export const StorefrontHeroImageScalarFieldEnumSchema = z.enum(['id', 'storageKey', 'derivativeKey', 'originalFileName', 'altText', 'mimeType', 'sizeBytes', 'width', 'height', 'focalX', 'focalY', 'overlayOpacity', 'isActive', 'createdAt', 'updatedAt'])

export type StorefrontHeroImageScalarFieldEnum = z.infer<typeof StorefrontHeroImageScalarFieldEnumSchema>;
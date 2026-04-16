import * as z from 'zod';

export const ProductContentScalarFieldEnumSchema = z.enum(['productId', 'titleSnapshot', 'brandSnapshot', 'refSnapshot', 'sizeSnapshot', 'movementSnapshot', 'glassSnapshot', 'strapClaspSnapshot', 'modelSnapshot', 'yearSnapshot', 'generatedContent', 'promptNote', 'generatedAt', 'createdAt', 'updatedAt', 'specBullets', 'hashtags'])

export type ProductContentScalarFieldEnum = z.infer<typeof ProductContentScalarFieldEnumSchema>;
import * as z from 'zod';

export const TechnicalPartCatalogScalarFieldEnumSchema = z.enum(['id', 'code', 'name', 'appliesTo', 'partGroup', 'sortOrder', 'isActive', 'note', 'createdAt', 'updatedAt'])

export type TechnicalPartCatalogScalarFieldEnum = z.infer<typeof TechnicalPartCatalogScalarFieldEnumSchema>;
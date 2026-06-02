import * as z from 'zod';

export const TechnicalDetailCatalogScalarFieldEnumSchema = z.enum(['id', 'area', 'code', 'name', 'description', 'sortOrder', 'isActive', 'createdAt', 'updatedAt'])

export type TechnicalDetailCatalogScalarFieldEnum = z.infer<typeof TechnicalDetailCatalogScalarFieldEnumSchema>;
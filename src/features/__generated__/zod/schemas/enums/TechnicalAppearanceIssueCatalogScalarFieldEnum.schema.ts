import * as z from 'zod';

export const TechnicalAppearanceIssueCatalogScalarFieldEnumSchema = z.enum(['id', 'code', 'area', 'label', 'deductionScore', 'sortOrder', 'isActive', 'note', 'createdAt', 'updatedAt'])

export type TechnicalAppearanceIssueCatalogScalarFieldEnum = z.infer<typeof TechnicalAppearanceIssueCatalogScalarFieldEnumSchema>;
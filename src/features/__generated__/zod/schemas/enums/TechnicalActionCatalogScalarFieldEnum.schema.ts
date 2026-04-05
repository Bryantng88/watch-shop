import * as z from 'zod';

export const TechnicalActionCatalogScalarFieldEnumSchema = z.enum(['id', 'code', 'name', 'appliesTo', 'groupKey', 'requiresPart', 'defaultExecutionMode', 'sortOrder', 'isActive', 'note', 'createdAt', 'updatedAt'])

export type TechnicalActionCatalogScalarFieldEnum = z.infer<typeof TechnicalActionCatalogScalarFieldEnumSchema>;
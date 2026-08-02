import * as z from 'zod';

export const StrapCatalogOptionScalarFieldEnumSchema = z.enum(['id', 'kind', 'code', 'name', 'colorHex', 'isActive', 'sortOrder', 'createdAt', 'updatedAt'])

export type StrapCatalogOptionScalarFieldEnum = z.infer<typeof StrapCatalogOptionScalarFieldEnumSchema>;
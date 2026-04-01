import * as z from 'zod';

export const SupplyCatalogScalarFieldEnumSchema = z.enum(['id', 'code', 'name', 'category', 'unit', 'defaultCost', 'note', 'isActive', 'sortOrder', 'createdAt', 'updatedAt'])

export type SupplyCatalogScalarFieldEnum = z.infer<typeof SupplyCatalogScalarFieldEnumSchema>;
import * as z from 'zod';

export const ServiceCatalogScalarFieldEnumSchema = z.enum(['id', 'code', 'name', 'description', 'defaultPrice', 'durationMin', 'isActive', 'createdAt', 'updatedAt', 'detail', 'vendorPrice', 'customerPrice', 'internalCost', 'note', 'categoryKey', 'sortOrder'])

export type ServiceCatalogScalarFieldEnum = z.infer<typeof ServiceCatalogScalarFieldEnumSchema>;
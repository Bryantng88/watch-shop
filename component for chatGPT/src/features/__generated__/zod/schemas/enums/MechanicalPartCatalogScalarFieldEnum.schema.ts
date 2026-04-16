import * as z from 'zod';

export const MechanicalPartCatalogScalarFieldEnumSchema = z.enum(['id', 'code', 'name', 'group', 'defaultCost', 'note', 'isActive', 'sortOrder', 'createdAt', 'updatedAt'])

export type MechanicalPartCatalogScalarFieldEnum = z.infer<typeof MechanicalPartCatalogScalarFieldEnumSchema>;
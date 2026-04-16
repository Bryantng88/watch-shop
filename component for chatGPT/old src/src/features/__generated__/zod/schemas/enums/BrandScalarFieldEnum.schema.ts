import * as z from 'zod';

export const BrandScalarFieldEnumSchema = z.enum(['id', 'name', 'slug', 'country', 'foundedYear', 'website', 'logoUrl', 'isAuthorized', 'status', 'description', 'sortOrder', 'createdAt', 'updatedAt'])

export type BrandScalarFieldEnum = z.infer<typeof BrandScalarFieldEnumSchema>;
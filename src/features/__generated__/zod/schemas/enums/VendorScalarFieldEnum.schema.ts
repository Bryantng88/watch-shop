import * as z from 'zod';

export const VendorScalarFieldEnumSchema = z.enum(['id', 'name', 'role', 'isAuthorized', 'email', 'phone', 'address', 'note', 'createdAt', 'updatedAt'])

export type VendorScalarFieldEnum = z.infer<typeof VendorScalarFieldEnumSchema>;
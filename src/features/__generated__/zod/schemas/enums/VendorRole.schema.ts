import * as z from 'zod';

export const VendorRoleSchema = z.enum(['SUPPLIER', 'SERVICE', 'BOTH', 'PRIVATE_SELLER'])

export type VendorRole = z.infer<typeof VendorRoleSchema>;
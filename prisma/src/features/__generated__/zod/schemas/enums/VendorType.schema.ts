import * as z from 'zod';

export const VendorTypeSchema = z.enum(['IN_HOUSE', 'PARTNER', 'AUTHORIZED', 'OTHER'])

export type VendorType = z.infer<typeof VendorTypeSchema>;
import * as z from 'zod';

export const StrapInventoryPolicySchema = z.enum(['STOCKED', 'NON_STOCK', 'SERIALIZED'])

export type StrapInventoryPolicy = z.infer<typeof StrapInventoryPolicySchema>;
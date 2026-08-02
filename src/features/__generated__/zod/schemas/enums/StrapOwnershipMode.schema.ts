import * as z from 'zod';

export const StrapOwnershipModeSchema = z.enum(['SHOP_INVENTORY', 'WATCH_ATTACHED', 'CUSTOMER_OWNED'])

export type StrapOwnershipMode = z.infer<typeof StrapOwnershipModeSchema>;
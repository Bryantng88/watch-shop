import * as z from 'zod';

export const PurchaseRequestContactPreferenceSchema = z.enum(['PHONE', 'ZALO'])

export type PurchaseRequestContactPreference = z.infer<typeof PurchaseRequestContactPreferenceSchema>;
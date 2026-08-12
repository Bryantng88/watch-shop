import * as z from 'zod';

export const PurchaseRequestIngressReceiptScalarFieldEnumSchema = z.enum(['id', 'requestKey', 'requestHash', 'purchaseRequestId', 'disposition', 'addedItemCount', 'createdAt'])

export type PurchaseRequestIngressReceiptScalarFieldEnum = z.infer<typeof PurchaseRequestIngressReceiptScalarFieldEnumSchema>;
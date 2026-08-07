import * as z from 'zod';

export const PurchaseRequestItemScalarFieldEnumSchema = z.enum(['id', 'purchaseRequestId', 'productId', 'titleSnapshot', 'listPriceSnapshot', 'quantity', 'createdAt'])

export type PurchaseRequestItemScalarFieldEnum = z.infer<typeof PurchaseRequestItemScalarFieldEnumSchema>;
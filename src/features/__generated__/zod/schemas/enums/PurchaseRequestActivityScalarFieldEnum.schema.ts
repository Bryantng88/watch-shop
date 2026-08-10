import * as z from 'zod';

export const PurchaseRequestActivityScalarFieldEnumSchema = z.enum(['id', 'purchaseRequestId', 'type', 'note', 'actorUserId', 'followUpAt', 'createdAt'])

export type PurchaseRequestActivityScalarFieldEnum = z.infer<typeof PurchaseRequestActivityScalarFieldEnumSchema>;
import * as z from 'zod';

export const StrapInventoryMovementScalarFieldEnumSchema = z.enum(['id', 'strapVariantId', 'movementType', 'quantity', 'balanceAfter', 'watchId', 'orderId', 'serviceRequestId', 'actorUserId', 'sourceType', 'sourceId', 'note', 'createdAt'])

export type StrapInventoryMovementScalarFieldEnum = z.infer<typeof StrapInventoryMovementScalarFieldEnumSchema>;
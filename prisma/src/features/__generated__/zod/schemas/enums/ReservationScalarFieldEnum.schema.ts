import * as z from 'zod';

export const ReservationScalarFieldEnumSchema = z.enum(['id', 'productId', 'orderId', 'status', 'depositAmt', 'expiresAt', 'createdAt', 'updatedAt'])

export type ReservationScalarFieldEnum = z.infer<typeof ReservationScalarFieldEnumSchema>;
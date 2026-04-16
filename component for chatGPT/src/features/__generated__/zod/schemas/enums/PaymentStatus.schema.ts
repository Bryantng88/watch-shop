import * as z from 'zod';

export const PaymentStatusSchema = z.enum(['UNPAID', 'PAID', 'REFUNDED', 'CANCELED'])

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
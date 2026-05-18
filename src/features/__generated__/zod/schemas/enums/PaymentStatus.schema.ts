import * as z from 'zod';

export const PaymentStatusSchema = z.enum(['UNPAID', 'PAID', 'REFUNDED', 'CANCELED', 'COLLECTED'])

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
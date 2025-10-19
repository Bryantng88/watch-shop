import * as z from 'zod';

export const PaymentMethodSchema = z.enum(['COD', 'MOMO', 'CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'CASH'])

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
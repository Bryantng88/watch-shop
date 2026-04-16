import * as z from 'zod';

export const PaymentDirectionSchema = z.enum(['IN', 'OUT'])

export type PaymentDirection = z.infer<typeof PaymentDirectionSchema>;